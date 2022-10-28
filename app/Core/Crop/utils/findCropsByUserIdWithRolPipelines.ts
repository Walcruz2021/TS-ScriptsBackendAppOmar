import { usersResponsibleByCountry } from '../../../../dataset/addRolInCompanies'

export const findCropsByUserIdWithRolPipelines = (identifier, alpha3Code) => {
  const lookupCountry = {
    from: 'countries',
    let: {
      id: '$country'
    },
    pipeline: [
      {
        $match: {
          $expr: {
            $eq: ['$_id', '$$id']
          }
        }
      },
      {
        $project: {
          name: 1,
          alpha3Code: '$alpha3Code'
        }
      }
    ],
    as: 'country'
  }
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
        $lookup: lookupCountry
      },
      {
        $unwind: '$country'
      },
      {
        $project: {
          _id: 1,
          identifier: 1,
          country: 1
        }
      }
    ],
    as: 'company'
  }
  const stageInit = [
    {
      $match: {
        cancelled: {
          $ne: true
        },
        'members.identifier': identifier
      }
    },
    {
      $unwind: '$members'
    },
    {
      $match: {
        'members.identifier': identifier
      }
    },
    {
      $group: {
        _id: {
          user: '$members.user',
          cropIdentifier: '$identifier'
        },
        cropIdentifier: { $first: '$identifier' },
        member: { $first: '$members' },
        crops: { $push: '$_id' }
      }
    },
    {
      $group: {
        _id: '$cropIdentifier',
        members: { $push: '$member' },
        crops: { $first: '$crops' }
      }
    },
    {
      $lookup: lookupCompanies
    },
    {
      $unwind: '$company'
    }
  ]
  if (identifier !== usersResponsibleByCountry[0].identifier) {
    stageInit.push({
      $match: {
        // @ts-ignore
        'company.country.alpha3Code': alpha3Code
      }
    })
  }
  const stageFinal = [
    {
      $replaceWith: {
        $mergeObjects: [
          '$company',
          { crops: '$crops' },
          { members: '$members' },
          { isResponsible: '$isResponsible' }
        ]
      }
    }
  ]
  return [...stageInit, ...stageFinal]
}
