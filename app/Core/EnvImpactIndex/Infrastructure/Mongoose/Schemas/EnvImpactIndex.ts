import { Schema } from '@ioc:Mongoose'
import { IEntity, TEiqRanges } from '../Interfaces/EnvImpactIndex.interface'

export const EnvImpactIndexSchema: Schema = new Schema(
  {
    crop: {
      type: Schema.Types.ObjectId,
      ref: 'Crop'
    },
    lot: {
      type: Schema.Types.ObjectId,
      ref: 'Lot'
    },
    activity: {
      type: Schema.Types.ObjectId,
      ref: 'Activity'
    },
    achievement: {
      type: Schema.Types.ObjectId,
      ref: 'Achievement'
    },
    entity: {
      type: String,
      enum: Object.values(IEntity),
      required: true
    },
    eiq: {
      value: {
        type: Number,
        required: true,
        default: 0
      },
      planned: {
        type: Number,
        required: true,
        default: 0
      },
      range: {
        type: String,
        enum: Object.values(TEiqRanges)
      }
    }
  },
  { timestamps: true }
)
