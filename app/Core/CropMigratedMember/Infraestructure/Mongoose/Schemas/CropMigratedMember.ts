import { Schema } from '@ioc:Mongoose'
import User from 'App/Core/User/Infrastructure/Mongoose/Models/User'

export const CropMigratedMemberSchema = new Schema(
  {
    crop: {
      type: Schema.Types.ObjectId,
      ref: 'Crop'
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: User
    },
    roleType: {
      type: String
    },
    identifier: String
  },
  { timestamps: true }
)
