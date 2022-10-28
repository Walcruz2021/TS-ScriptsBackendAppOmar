import { Schema } from '@ioc:Mongoose'
import Roles from '../../../../Rol/Infrastructure/Mongoose/Models/Rol'

export const FlagSchema: Schema = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true
    },
    codeLabel: {
      type: String
    },
    allowedRoles: [
      {
        role: { type: Schema.Types.ObjectId, ref: Roles }
      }
    ]
  },
  { timestamps: true }
)
