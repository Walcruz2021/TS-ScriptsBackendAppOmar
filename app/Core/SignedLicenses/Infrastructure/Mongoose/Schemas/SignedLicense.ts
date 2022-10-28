import { Schema } from '@ioc:Mongoose'

export const SignedLicenseSchema: Schema = new Schema(
  {
    id: { type: String },
    licenseId: {
      type: Schema.Types.ObjectId,
      ref: 'Licenses',
      require: false,
      index: true
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      require: false,
      index: true
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      require: false
    },
    hectareUsedCounter: { type: Number, min: 0, default: 0 },
    fileKey: {
      type: String
    },
    timestamp: {
      type: Number
    },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
)
