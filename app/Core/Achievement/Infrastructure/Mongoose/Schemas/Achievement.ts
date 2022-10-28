import { Schema } from '@ioc:Mongoose'

export const AchievementSchema: Schema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, required: false },
    envImpactIndex: {
      type: Schema.Types.ObjectId,
      ref: 'EnvImpactIndex'
    },
    key: {
      type: String,
      required: false
    },
    dateAchievement: {
      type: Date,
      required: false
    },
    surface: {
      type: Number,
      required: false
    },
    percent: {
      type: Number,
      default: 0
    },
    eiqSurface: {
      type: Number
    },
    isRejected: {
      type: Boolean,
      default: false
    },
    lots: [{ type: Schema.Types.ObjectId, ref: 'Lot' }],
    lotsWithSurface: [
      {
        lot: { type: Schema.Types.ObjectId, ref: 'Lot' },
        surfacePlanned: {
          type: Number
        },
        surfaceAchievement: {
          type: Number
        },
        tag: {
          type: String
        }
      }
    ],
    supplies: [
      {
        name: {
          type: String
        },
        unit: {
          type: String
        },
        quantity: {
          type: Number
        },
        typeId: {
          type: Schema.Types.ObjectId,
          ref: 'SupplyType'
        },
        supply: {
          type: Schema.Types.ObjectId,
          ref: 'Supply'
        },
        icon: {
          type: String
        },
        total: {
          type: Number
        },
        unitTypeSupply: {
          type: Schema.Types.ObjectId,
          ref: 'UnitTypeSupply'
        },
        brand: {
          type: String
        },
        code: {
          type: String
        }
      }
    ],
    files: [{ type: Schema.Types.ObjectId, ref: 'FileDocument' }],
    destination: [
      {
        unitType: {
          type: Schema.Types.ObjectId
        },
        tonsHarvest: {
          type: Number
        },
        destinationAddress: {
          type: String
        },
        label: {
          type: String
        }
      }
    ],
    signers: [
      {
        userId: {
          type: Schema.Types.ObjectId
        },
        fullName: {
          type: String
        },
        email: {
          type: String
        },
        type: {
          type: String
        },
        signed: {
          type: Boolean,
          default: false
        },
        dateSigned: {
          type: Date
        }
      }
    ],
    synchronizedList: [
      {
        service: {
          type: String
        },
        isSynchronized: {
          type: Boolean,
          default: false
        }
      }
    ],
    subTypeActivity: {
      type: Schema.Types.ObjectId,
      ref: 'SubTypeActivity'
    },
    keySubTypesActivity: {
      type: String,
      required: false
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: 'Company'
    },
    crop: {
      type: Schema.Types.ObjectId,
      ref: 'Crop'
    },
    activity: {
      type: Schema.Types.ObjectId,
      ref: 'Activity'
    },
    createdAt: Date,
    updatedAt: Date
  },
  {
    timestamps: true
  }
)
