import { Schema } from '@ioc:Mongoose'

export const LandscapeSustainabilitySchema: Schema = new Schema(
  {
    crop: {
      type: Schema.Types.ObjectId,
      ref: 'Crop',
      index: true
    },
    nameSchema: {
      type: String,
      index: true
    },
    lot: {
      type: Schema.Types.ObjectId,
      ref: 'Lot',
      index: true
    },
    normative: {
      type: Schema.Types.ObjectId,
      ref: 'NormativeConfig'
    },
    generalCountryNormative: {
      type: Boolean
    },
    totals: {
      availableArea: Number,
      totalAreaOfIntersections: Number,
      fieldArea: Number,
      percentageOfTheTotalInterceptionArea: Number
    },
    evidences: [
      {
        name: String,
        description: String,
        url: String,
        format: String,
        fileId: { type: Schema.Types.ObjectId, ref: 'FileDocument' },
        key: String
      }
    ],
    datasets: [
      {
        name: String,
        percent: Number,
        intersectArea: Number
      }
    ],
    error: {
      type: Boolean,
      default: false
    },
    notBelongToCrop: {
      type: Boolean,
      default: false
    },
    codeError: {
      type: String
    },
    descriptionError: {
      type: String
    }
  },
  { timestamps: true }
)
