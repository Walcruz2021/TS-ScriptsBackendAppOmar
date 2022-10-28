import { CompanyTypeEnum } from 'App/Core/CompanyType/Infrastructure/enums/CompanyType.enum'
import ObjectID from 'bson-objectid'

export const findUsersByCompanyTypePipelines = (
  companyType: CompanyTypeEnum,
  userId?: string
): any[] => {
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
      companiesIds: '$companies.company'
    },
    pipeline: [
      {
        $match: {
          $expr: {
            $in: ['$_id', '$$companiesIds']
          }
        }
      },
      {
        $lookup: lookupCompanyTypes
      },
      {
        $lookup: lookupCountry
      },
      {
        $unwind: '$country'
      }
    ],
    as: 'companiesWithType'
  }

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
      $lookup: lookupCompanies
    },
    {
      $match: {
        'companiesWithType.types.name': companyType
      }
    },
    {
      $addFields: {
        companiesWithType: {
          $filter: {
            input: '$companiesWithType',
            as: 'company',
            cond: {
              $eq: ['$$company.types.name', [companyType]]
            }
          }
        }
      }
    }
  ]

  if (userId) {
    pipelines.unshift({
      // @ts-ignore
      $match: {
        // @ts-ignore
        _id: new ObjectID(userId)
      }
    })
  }

  return pipelines
}
