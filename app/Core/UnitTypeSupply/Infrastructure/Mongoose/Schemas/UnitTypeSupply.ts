import { Schema } from '@ioc:Mongoose'

export const UnitTypeSupplySchema: Schema = new Schema(
  {
    key: {
      type: String,
      unique: true
    },
    name: {
      type: Schema.Types.Mixed
    },
    equivalence: [
      {
        country: {
          type: String
        },
        value: {
          type: String
        }
      }
    ],
    unitMeasureSystem: {
      type: String
    },
    UnitMeasureSystem: {
      type: String
    },
    typeMeasure: {
      type: String
    }
  },
  { timestamps: true }
)
