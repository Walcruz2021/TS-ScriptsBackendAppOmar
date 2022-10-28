import { Schema } from '@ioc:Mongoose'

export const RolSchema: Schema = new Schema(
  {
    label: {
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
        required: true
      }
    },
    value: {
      type: String,
      require: true
    },
    isInactive: {
      type: Boolean,
      defaultStatus: false
    },
    canMarkFlags: [
      {
        flag: { type: String },
        targetRoles: { type: Array }
      }
    ],
    assignable: [String],
    equivalentRole: {
      type: String,
      unique: true
    },
    companyTypes: [String],
    assignableCompany: {
      withFlagAdmin: [
        {
          name: String,
          isAdmin: Boolean,
          isResponsible: Boolean
        }
      ],
      withoutFlagAdmin: [
        {
          name: String,
          isAdmin: Boolean,
          isResponsible: Boolean
        }
      ]
    },
    assignableCrop: [String],
    permissions: [String]
  },
  {
    timestamps: true
  }
)
