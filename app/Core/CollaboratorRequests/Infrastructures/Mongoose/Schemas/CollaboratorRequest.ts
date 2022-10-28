import { Schema } from '@ioc:Mongoose'
import { StateCollaboratorRequestTypes } from '../Enums'

export const CollaboratorRequestSchema: Schema = new Schema(
  {
    company: {
      type: Schema.Types.ObjectId,
      ref: 'Company'
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: Object.values(StateCollaboratorRequestTypes),
      default: 'pending'
    },
    createdAt: Date,
    updatedAt: Date
  },
  { timestamps: true }
)
