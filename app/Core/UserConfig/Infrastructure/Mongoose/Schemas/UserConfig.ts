import { Schema } from '@ioc:Mongoose'

export const UserConfigSchema: Schema = new Schema(
  {
    fromInvitation: {
      type: Boolean,
      default: false
    },
    hasPin: {
      type: Boolean,
      default: false
    },
    companySelected: {
      type: Schema.Types.ObjectId,
      ref: 'Company'
    },
    languageSelected: {
      type: String,
      default: 'es'
    },
    roleSelected: {
      type: Schema.Types.ObjectId,
      ref: 'Role'
    },
    isAdmin: {
      type: Boolean,
      default: false
    },
    isResponsible: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
)
