import { Schema } from '@ioc:Mongoose'

const fileObject = {
  filePath: {
    type: String
  },
  url: {
    type: String
  }
}

export const UserSchema: Schema = new Schema(
  {
    firstName: {
      type: String
    },
    lastName: {
      type: String
    },
    phone: {
      type: String
    },
    email: {
      type: String,
      unique: true
    },
    pin: {
      type: String
    },
    verifyToken: {
      type: String
    },
    isInactive: {
      type: Boolean,
      default: false
    },
    avatar: { type: String, required: false },
    avatarCloud: {
      type: fileObject
    },
    collaboratorRequest: [
      {
        type: Schema.Types.ObjectId,
        ref: 'CollaboratorRequest'
      }
    ],
    companies: [
      {
        company: {
          type: Schema.Types.ObjectId,
          ref: 'Company'
        },
        isAdmin: {
          type: Boolean,
          default: true
        },
        identifier: String
      }
    ],
    config: { type: Schema.Types.ObjectId, ref: 'UserConfig' }
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
)
