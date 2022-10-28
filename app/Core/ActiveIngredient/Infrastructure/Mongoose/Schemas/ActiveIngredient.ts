import { Schema } from '@ioc:Mongoose'

export const ActiveIngredientSchema: Schema = new Schema(
  {
    name: {
      en: {
        type: String,
        required: false
      },
      es: {
        type: String,
        required: false
      },
      pt: {
        type: String,
        required: false
      }
    },
    eiq: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
)
