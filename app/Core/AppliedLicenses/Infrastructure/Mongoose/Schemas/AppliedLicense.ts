import { Schema } from '@ioc:Mongoose'

export const AppliedLicenseSchema: Schema = new Schema(
  {
    id: {
      type: String
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      require: true,
      index: true
    },
    companyIdentifier: {
      type: String
    },
    licenseId: {
      type: Schema.Types.ObjectId,
      ref: 'Licenses',
      require: true
    },
    cropId: {
      type: Schema.Types.ObjectId,
      ref: 'Crop',
      require: true
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      require: true
    },
    lots: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Lot',
        require: true
      }
    ],
    appliedSurface: {
      type: Number,
      min: 0,
      default: 0,
      require: true
    },
    subLicenseId: {
      type: Schema.Types.ObjectId,
      ref: 'SubLicenses',
      default: null
    },
    appliedSubLicenses: [
      {
        type: Schema.Types.ObjectId,
        ref: 'AppliedLicense',
        default: null
      }
    ],
    subLicenses: [
      {
        type: Schema.Types.ObjectId,
        ref: 'SubLicenses',
        default: null
      }
    ]
  },
  {
    timestamps: true
  }
)
