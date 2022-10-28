export const findUserByCompanyIdPipelines = (companyId) => {
  const pipelines = [
    {
      $redact: {
        $cond: {
          if: {
            $gt: [
              {
                $size: { $ifNull: ['$companies', []] }
              },
              0
            ]
          },
          then: '$$KEEP',
          else: '$$PRUNE'
        }
      }
    },
    {
      $unwind: '$companies'
    },
    {
      $match: {
        'companies.company': companyId
      }
    },
    {
      $project: {
        isAdmin: '$companies.isAdmin',
        companyId: '$companies.company'
      }
    }
  ]
  return pipelines
}
