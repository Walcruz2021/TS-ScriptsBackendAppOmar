import { Document } from '@ioc:Mongoose'

export interface SupplyType {
  _id?: string
  name: string
  code: string
  icon: string
  activities: Array<String>
  cropTypes: Array<String>
  tags: Array<String>
}

export type SupplyTypeDocument = SupplyType & Document
