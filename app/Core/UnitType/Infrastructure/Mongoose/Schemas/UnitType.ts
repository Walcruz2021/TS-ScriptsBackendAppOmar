import { Schema } from '@ioc:Mongoose'

export const UnitTypeSchema: Schema = new Schema(
  {
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
    key: {
      type: String,
      require: true
    },
    unitMeasureSystem: {
      type: String
    },
    requireCropType: {
      type: Boolean
    },
    equivalence: {
      unit: {
        type: String
      },
      value: {
        type: String
      }
    }
  },
  { timestamps: true }
)
