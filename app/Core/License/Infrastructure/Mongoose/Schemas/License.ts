import { Schema } from '@ioc:Mongoose'
import fileSchema from 'App/Core/FileDocument/Infrastructure/Mongoose/Schemas/FileDocument'
import {
  AllowIntersection,
  LicenseState,
  LicenseStatus,
  LicenseTypes
} from '../Interfaces/License.interface'

export const LicenseSchema: Schema = new Schema(
  {
    id: { type: String },
    countryId: {
      type: Schema.Types.ObjectId,
      index: true,
      require: true,
      ref: 'Countries'
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
      enum: Object.values(LicenseStatus),
      default: LicenseStatus.PENDING
    },
    type: {
      type: String,
      require: true,
      enum: Object.values(LicenseTypes)
    },
    name: { type: String, require: true },
    slug: { type: String },
    previewDescription: { type: String, require: true },
    companyIdentifier: { type: String, index: true, require: true },
    cropType: {
      type: Schema.Types.ObjectId,
      ref: 'CropType',
      require: true
    },
    startDatePost: { type: Date, require: true, index: true },
    endDatePost: { type: Date, require: true },
    state: {
      type: String,
      enum: Object.values(LicenseState),
      default: LicenseState.NEW
    },
    termsAndConditions: { type: String },
    clauses: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Clauses'
        }
      ]
    },
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
    startDate: { type: Date, require: true },
    endDate: { type: Date, require: true },
    companyUsers: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: 'User'
        }
      ]
    },
    userViewCounter: { type: Number, min: 0, default: 0 },
    hectareLimit: { type: Number, min: 0, default: 0 },
    hectareMinIdentifier: { type: Number, min: 0, default: 0 },
    hectareLimitIdentifier: { type: Number, min: 0, default: 0 },
    timeLeftPost: { type: Number, min: 0, default: 0 },
    timeLeftNew: { type: Number, min: 0, default: 0 },
    hectareUsedCounter: { type: Number, min: 0, default: 0 },
    hectareLeftPercentage: { type: Number, min: 0, default: 0 },
    imageOriginal: { type: fileSchema, default: null },
    imageIntermediate: { type: fileSchema, default: null },
    imageThumbnail: { type: fileSchema, default: null },
    termsAndConditionsTemplate: { type: fileSchema, default: null },
    normative: {
      type: String
    },
    allowIntersection: {
      type: String,
      enum: Object.values(AllowIntersection)
    },
    fieldsHash: { type: String },
    subLicenses: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: 'SubLicenses'
        }
      ],
      default: null
    },
    verifierCompanies: [
      {
        company: {
          type: Schema.Types.ObjectId,
          ref: 'Company',
          require: true,
          index: true
        },
        verifierUsers: [
          {
            user: {
              type: Schema.Types.ObjectId,
              ref: 'User'
            },
            identifier: {
              type: String,
              default: true
            }
          }
        ]
      }
    ],
    verificationType: {
      type: Schema.Types.ObjectId,
      index: true,
      ref: 'VerificationType'
    },
    idLicense: { type: Number, min: 1, unique: true }
  },
  { timestamps: true }
)
