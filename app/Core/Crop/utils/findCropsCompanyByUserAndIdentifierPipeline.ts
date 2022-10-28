export const getCropsCompaniesByUserAndIdentifier = (
  userId: string,
  identifier: string
) => {
  const lookupCompanyTypes = {
    from: 'companytypes',
    let: {
      typeIds: '$types'
    },
    pipeline: [
      {
        $match: {
          $expr: {
            $in: ['$_id', '$$typeIds']
          }
        }
      }
    ],
    as: 'types'
  }

  const lookupCompanies = {
    from: 'companies',
    let: {
      identifierList: '$companies'
    },
    pipeline: [
      {
        $match: {
          $expr: {
            $in: ['$identifier', '$$identifierList']
          }
        }
      },
      {
        $lookup: lookupCompanyTypes
      }
    ],
    as: 'companies'
  }

  const pipeline = [
    {
      $match: {
        members: {
          $elemMatch: {
            user: userId,
            identifier: identifier
          }
        }
      }
    },
    {
      $unwind: {
        path: '$members'
      }
    },
    {
      $match: {
        'members.user': userId,
        'members.identifier': identifier
      }
    },
    {
      $group: {
        _id: '$_id',
        user: {
          $first: '$members.user'
        },
        cropId: {
          $first: '$_id'
        },
        cropIdentifier: {
          $first: '$identifier'
        },
        members: {
          $push: {
            crop: '$_id',
            memberId: '$members._id',
            type: '$members.type',
            identifier: '$members.identifier',
            cropIdentifier: '$identifier'
          }
        }
      }
    },
    {
      $group: {
        _id: '$user',
        companies: {
          $push: '$cropIdentifier'
        },
        members: {
          $push: '$members'
        }
      }
    },
    {
      $lookup: lookupCompanies
    },
    {
      $addFields: {
        member: {
          $first: '$members'
        }
      }
    },
    {
      $unwind: {
        path: '$member'
      }
    }
  ]

  return pipeline
}
