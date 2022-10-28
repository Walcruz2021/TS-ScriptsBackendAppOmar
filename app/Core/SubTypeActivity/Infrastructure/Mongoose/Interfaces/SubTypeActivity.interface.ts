import { ObjectId, Document } from '@ioc:Mongoose'

export interface SubTypeActivity {
  _id?: string | ObjectId | any
  activityType: String
  key: String
  codeLabel?: String
}

export type SubTypeActivityDocument = SubTypeActivity & Document
