import { Schema } from '@ioc:Mongoose'

export const EvidenceConceptSchema: Schema = new Schema(
  {
    code: {
      type: String
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
        required: false
      }
    }
  },
  { timestamps: true }
)
