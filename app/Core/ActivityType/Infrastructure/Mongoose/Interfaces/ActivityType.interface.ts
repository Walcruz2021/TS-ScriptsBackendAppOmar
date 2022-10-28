import { ObjectId, Document } from '@ioc:Mongoose'
import { NameLanguaje } from 'App/Core/commons'

export interface ActivityType {
  _id?: string | ObjectId | any
  name: NameLanguaje
  tag: string
  canPlanning: boolean
}

export type ActivityTypeDocument = ActivityType & Document
