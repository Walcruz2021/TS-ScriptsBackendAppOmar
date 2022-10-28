import { Document } from '@ioc:Mongoose'
import { Activity } from 'App/Core/Activity/Infrastructure/Mongoose/Interfaces'
import { Company } from 'App/Core/Company/Infrastructure/Mongoose/Interfaces'

export interface Crop {
  _id?: string
  name?: string
  pay?: number
  dateCrop?: Date
  dateHarvest?: Date
  surface?: number
  volume?: number
  cancelled?: boolean
  downloaded?: boolean
  cropType?: CropType
  envImpactIndex?: any
  unitType?: UnitType
  members?: Members[]
  lots?: any[]
  pending?: Activity[]
  toMake?: Activity[]
  done?: Activity[]
  finished?: Activity[]
  badges?: any[]
  syncronizedList?: any[]
  company?: Company
  activities?: Activity[]
  createdAt?: Date
  updatedAt?: string
}

interface CropType {
  name: CropTypeName
  key: string
  keyLabel?: string
}

export type CropTypeName = {
  en: string
  es: string
}
export interface UnitType {
  name: UnitTypeName
  key: string
}

export type UnitTypeName = {
  en: string
  es: string
}
export interface Members {
  _id?: string
  identifier: string
  type: string
  tag?: string
  producer: boolean
  company?: string | any
  user: string | any
  country: string | any
}
export const collectionName = 'Crop'

export type CropDocument = Crop & Document
