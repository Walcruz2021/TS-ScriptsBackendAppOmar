import { Schema } from '@ioc:Mongoose'

export const TypeAgreementSchema: Schema = new Schema(
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
        required: false
      }
    },
    key: {
      type: String,
      required: true
    },
    visible: [String]
  },
  { timestamps: true }
)
