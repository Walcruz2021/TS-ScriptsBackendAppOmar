import { Schema } from '@ioc:Mongoose'
import { BadgeTypes } from '../Enums'

export const BadgeSchema: Schema = new Schema(
  {
    type: {
      type: String,
      enum: Object.values(BadgeTypes),
      required: true,
      unique: true
    },
    name: {
      en: {
        type: String,
        required: true
      },
      es: {
        type: String,
        required: true
      },
      pt: {
        type: String,
        required: true
      }
    },
    goalReach: {
      type: Number,
      required: true
    },
    image: {
      type: String,
      required: true
    },
    createdAt: Date,
    updatedAt: Date
  },
  {
    timestamps: true
  }
)
