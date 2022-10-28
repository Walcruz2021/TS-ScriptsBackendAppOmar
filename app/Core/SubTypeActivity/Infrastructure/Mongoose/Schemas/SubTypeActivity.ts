import { Schema } from '@ioc:Mongoose'

export const SubTypeActivitySchema: Schema = new Schema(
  {
    activityType: {
      type: Schema.Types.ObjectId,
      ref: 'ActivityType'
    },
    key: {
      type: String,
      required: true,
      unique: true
    },
    codeLabel: {
      type: String
    }
  },
  { timestamps: true }
)
