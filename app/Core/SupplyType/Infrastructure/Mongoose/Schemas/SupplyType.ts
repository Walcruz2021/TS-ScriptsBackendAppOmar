import { Schema } from '@ioc:Mongoose'

export const SupplyTypeSchema: Schema = new Schema(
  {
    name: {
      type: String
    },
    code: {
      type: String
    },
    icon: {
      type: String
    },
    activities: [
      {
        type: String
      }
    ],
    cropTypes: [
      {
        type: String
      }
    ],
    tags: [
      {
        type: String
      }
    ]
  },
  { timestamps: true }
)
