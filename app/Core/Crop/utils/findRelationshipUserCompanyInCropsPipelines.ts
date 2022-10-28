export const findRelationshipUserCompanyInCropsPipelines = (userId): any[] => {
  const lookupCompanies = {
    from: 'companies',
    let: {
      identifier: '$_id'
    },
    pipeline: [
      {
        $match: {
          $expr: { $eq: ['$identifier', '$$identifier'] }
        }
      },
      {
        $project: {
          _id: 1,
          identifier: 1
        }
      }
    ],
    as: 'company'
  }
  const pipelines = [
    {
      $match: {
        members: { $elemMatch: { user: userId } }
      }
    },
    {
      $unwind: '$members'
    },
    {
      $match: {
        'members.user': userId
      }
    },
    {
      $group: {
        _id: '$members.identifier'
      }
    },
    {
      $lookup: lookupCompanies
    },
    {
      $unwind: {
        path: '$company',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $unwind: '$company'
    }
  ]
  return pipelines
}
