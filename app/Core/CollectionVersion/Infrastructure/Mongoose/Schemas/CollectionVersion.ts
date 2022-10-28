import { Schema } from '@ioc:Mongoose'

export const CollectionVersionSchema: Schema = new Schema(
  {
    collectionName: String,
    versionDate: {
      type: Date,
      default: Date.now()
    }
  },
  { timestamps: true }
)
