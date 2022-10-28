import { Schema } from '@ioc:Mongoose'

export const FileLogLot: Schema = new Schema(
  {
    locationS3: {
      type: String,
      require: true
    },
    dateExecution: { type: Date, require: true, index: true },
    name: {
      type: String,
      required: true
    },
    key: {
      type: String,
      required: true
    },
    bucket: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
)
