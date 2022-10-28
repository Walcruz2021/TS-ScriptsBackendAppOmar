import { Schema } from '@ioc:Mongoose'

export const NormativeConfigSchema: Schema = new Schema(
  {
    alphaCode: { type: String, required: true },
    cropsType: [{ type: String, required: true }],
    normative: { type: String, required: true },
    dateReference: { type: Date, required: true },
    generalCountryNormative: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
)
