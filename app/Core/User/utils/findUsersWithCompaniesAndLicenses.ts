import ObjectID from 'bson-objectid'
export const findUsersWithCompaniesAndLicenses = (userId?: string) => {
  const pipeline = [
    {
      $unwind: {
        path: '$companies'
      }
    },
    {
      $lookup: {
        from: 'licenses',
        let: {
          companyIds: '$companies.company',
          userId: '$_id'
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ['$companyId', '$$companyIds']
              }
            }
          },
          {
            $match: {
              $expr: {
                $in: ['$$userId', '$companyUsers']
              }
            }
          }
        ],
        as: 'licenses'
      }
    },
    {
      $redact: {
        $cond: {
          if: {
            $gt: [
              {
                $size: {
                  $ifNull: ['$licenses', []]
                }
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
      $lookup: {
        from: 'companies',
        let: {
          companiesIds: '$companies.company'
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ['$_id', '$$companiesIds']
              }
            }
          }
        ],
        as: 'company'
      }
    },
    {
      $unwind: {
        path: '$company'
      }
    },
    {
      $group: {
        _id: '$_id',
        companiesWithType: {
          $push: '$company'
        },
        email: {
          $first: '$email'
        },
        companies: {
          $push: '$companies'
        }
      }
    }
  ]

  if (userId) {
    pipeline.unshift({
      // @ts-ignore
      $match: {
        // @ts-ignore
        _id: new ObjectID(userId)
      }
    })
  }

  return pipeline
}
