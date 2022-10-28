export const getCompaniesWithCropsByUserRole = (
  roleId: string,
  isAdmin = false
) => {
  const pipeline = [
    {
      $match: {
        users: {
          $elemMatch: {
            role: roleId,
            isAdmin: isAdmin
          }
        }
      }
    },
    {
      $addFields: {
        usersWithCondition: {
          $filter: {
            input: '$users',
            as: 'user',
            cond: {
              $and: [
                {
                  $eq: ['$$user.role', roleId]
                },
                {
                  $eq: ['$$user.isAdmin', isAdmin]
                }
              ]
            }
          }
        }
      }
    },
    {
      $lookup: {
        from: 'crops',
        let: {
          identifier: '$identifier'
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ['$identifier', '$$identifier']
              }
            }
          }
        ],
        as: 'crops'
      }
    }
  ]

  return pipeline
}
