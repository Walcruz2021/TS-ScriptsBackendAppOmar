import ObjectID from 'bson-objectid'

export const findUsersWithPaginationPipelines = (
  currentPage,
  limit,
  userId?
) => {
  const page = currentPage > 0 ? currentPage - 1 : 0
  const pipelines = [
    {
      $match: {
        $or: [
          {
            isInactive: false
          },
          {
            isInactive: { $exists: false }
          }
        ]
      }
    },
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
      $facet: {
        metaInfo: [
          {
            $count: 'totalItems'
          },
          {
            $addFields: {
              currentPage: {
                $literal: page + 1
              },
              itemsPerPage: {
                $literal: limit
              },
              totalPages: {
                $ceil: {
                  $divide: ['$totalItems', limit]
                }
              }
            }
          }
        ],
        results: [{ $skip: page * limit }, { $limit: limit }]
      }
    },
    {
      $unwind: '$metaInfo'
    }
  ]
  if (userId) {
    pipelines.unshift({
      $match: {
        // @ts-ignore
        _id: new ObjectID(userId)
      }
    })
  }
  return pipelines
}
