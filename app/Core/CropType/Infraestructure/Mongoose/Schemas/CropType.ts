import { Schema } from '@ioc:Mongoose'

export const CropTypeSchema = new Schema(
  {
    name: {
      en: {
        type: String
      },
      es: {
        type: String
      },
      pt: {
        type: String
      }
    },
    key: {
      type: String
    },
    equivalences: [
      {
        unit: String,
        value: Number
      }
    ],
    createdAt: Date,
    updatedAt: Date
  },
  { timestamps: true }
)
