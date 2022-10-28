import { Schema } from '@ioc:Mongoose'
import fileSchema from 'App/Core/FileDocument/Infrastructure/Mongoose/Schemas/FileDocument'
import { SubLicenseStatus } from '../Interfaces/SubLicense.interface'

export const SubLicenseSchema: Schema = new Schema(
  {
    id: { type: String },
    licenseId: {
      type: Schema.Types.ObjectId,
      index: true,
      require: true,
      ref: 'License'
    },
    companyId: {
      type: Schema.Types.ObjectId,
      index: true,
      require: true,
      ref: 'Company'
    },
    status: {
      type: String,
      index: true,
      enum: Object.values(SubLicenseStatus),
      default: SubLicenseStatus.ACTIVE
    },
    companyIdentifier: { type: String, index: true, require: true },
    accessibleIdentifier: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Company'
        }
      ]
    },
    inaccessibleIdentifier: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Company'
        }
      ]
    },
    companyUsers: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: 'User'
        }
      ]
    },
    fieldsHash: { type: String },
    userViewCounter: { type: Number, min: 0, default: 0 },
    hectareLimit: { type: Number, min: 0, default: 0 },
    hectareMinIdentifier: { type: Number, min: 0, default: 0 },
    hectareLimitIdentifier: { type: Number, min: 0, default: 0 },
    hectareUsedCounter: { type: Number, min: 0, default: 0 },
    image: { type: fileSchema, default: null },
    imageIntermediate: { type: fileSchema, default: null },
    imageThumbnail: { type: fileSchema, default: null },
    idSublicense: { type: Number, min: 1, unique: true }
  },
  { timestamps: true }
)
