import { Schema } from '@ioc:Mongoose'
import { TEiqRanges } from '../Interfaces/EiqRanges.interface'

export const EiqRangesSchema: Schema = new Schema(
  {
    type: {
      type: String,
      enum: Object.values(TEiqRanges),
      required: true,
      unique: true
    },
    range: {
      min: {
        type: Number,
        required: true
      },
      max: {
        type: Number
      }
    }
  },
  { timestamps: true }
)
