import { Schema } from '@ioc:Mongoose'

export const ApprovalRegisterSignSchema: Schema = new Schema(
  {
    ots: {
      type: String
    },
    hash: {
      type: String
    },
    activity: {
      type: Schema.Types.ObjectId,
      ref: 'Activity'
    },
    filePdf: {
      type: Schema.Types.ObjectId,
      ref: 'FileDocument'
    },
    fileOts: {
      type: Schema.Types.ObjectId,
      ref: 'FileDocument'
    },
    createdAt: Date,
    updatedAt: Date
  },
  { timestamps: true }
)
