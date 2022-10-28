import { Schema } from '@ioc:Mongoose'

export const ActivityTypeSchema: Schema = new Schema(
  {
    name: {
      en: {
        type: String,
        required: true
      },
      es: {
        type: String,
        required: true
      }
    },
    tag: {
      type: String,
      required: true
    },
    canPlanning: {
      type: Boolean
    },
    createdAt: Date,
    updatedAt: Date
  },
  { timestamps: true }
)
