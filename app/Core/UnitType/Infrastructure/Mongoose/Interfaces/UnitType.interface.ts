import { Document } from '@ioc:Mongoose'

export interface UnitType {
  _id?: string
  name: {
    en: String
    es: String
    pt: String
  }
  key: String
  unitMeasureSystem?: String
  requireCropType?: Boolean
  equivalence?: {
    unit: String
    value: String
  }
}

export const collectionName = 'UnitType'

export type UnitTypeDocument = UnitType & Document
