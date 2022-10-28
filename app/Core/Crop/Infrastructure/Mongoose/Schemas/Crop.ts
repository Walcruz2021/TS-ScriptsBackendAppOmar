import { Schema } from '@ioc:Mongoose'
import User from '../../../../User/Infrastructure/Mongoose/Models/User'
import CropType from '../../../../CropType/Infraestructure/Mongoose/Models/CropType'
import Company from 'App/Core/Company/Infrastructure/Mongoose/Models/Company'

export const CropSchema: Schema = new Schema(
  {
    name: {
      type: String,
      require: true
    },
    pay: {
      type: Number,
      require: false
    },
    dateCrop: {
      type: Date,
      require: false
    },
    dateHarvest: {
      type: Date,
      require: false
    },
    surface: {
      type: Number,
      require: true
    },
    volume: {
      type: Number
    },
    cancelled: {
      type: Boolean,
      default: false
    },
    downloaded: {
      type: Boolean,
      default: false
    },
    identifier: {
      type: String
    },
    cropType: {
      type: Schema.Types.ObjectId,
      ref: CropType
    },
    envImpactIndex: {
      type: Schema.Types.ObjectId,
      ref: 'EnvImpactIndex'
    },
    unitType: {
      type: Schema.Types.ObjectId,
      ref: 'UnitType'
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: Company
    },
    members: [
      {
        identifier: String,
        type: {
          type: String,
          default: 'PRODUCER'
        },
        tag: {
          type: String
        },
        producer: {
          type: Boolean,
          default: true
        },
        user: {
          type: Schema.Types.ObjectId,
          ref: User
        },
        country: {
          type: Schema.Types.ObjectId,
          ref: 'Country'
        },
        company: {
          type: Schema.Types.ObjectId,
          ref: 'Company'
        },
        isOfflineEnabled: {
          type: Boolean,
          default: false
        }
      }
    ],
    lots: [
      {
        tag: {
          type: String,
          require: true
        },
        farm: {
          type: Schema.Types.ObjectId,
          ref: 'Farm'
        },
        data: [
          {
            type: Schema.Types.ObjectId,
            ref: 'Lot'
          }
        ]
      }
    ],
    pending: [{ type: Schema.Types.ObjectId, ref: 'Activity' }],
    toMake: [{ type: Schema.Types.ObjectId, ref: 'Activity' }],
    done: [{ type: Schema.Types.ObjectId, ref: 'Activity' }],
    finished: [{ type: Schema.Types.ObjectId, ref: 'Activity' }],
    createdAt: Date,
    updatedAt: Date,
    badges: [
      {
        typeAgreement: {
          type: Schema.Types.ObjectId,
          ref: 'TypeAgreement',
          require: true
        },
        badge: {
          type: Schema.Types.ObjectId,
          ref: 'Badge',
          require: true
        },
        surfaceTotal: {
          type: Number,
          require: true
        }
      }
    ],
    pdfHistory: { type: Schema.Types.ObjectId, ref: 'FileDocument' }
  },

  {
    toJSON: {
      virtuals: true
    },
    toObject: {
      virtuals: true
    },
    timestamps: true
  }
)
// After update events
// @ts-ignore
// SupplySchema.post(['save'], function () {
//   const setData: ICollectionVersion = {
//     collectionName: collectionName,
//     versionDate: new Date(),
//   }
//   CollectionVersionRepository.createOrUpdate(setData).then()
// })
