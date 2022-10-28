import { Document } from '@ioc:Mongoose'
import { UnitMeasureSystemEnum } from 'App/Core/Company/enums/UnitMeasureSystem.enum'

export interface UnitTypeSupply {
  key: string
  name: string
  equivalence?: Equivalence[]
}
export interface Equivalence {
  country?: string
  value?: string
  unitMeasureSystem?: UnitMeasureSystemEnum
  typeMeasure?: string
}

export const unitTypeSupplyCollectionName = 'unittypesupplies'

export type UnitTypeSupplyDocument = UnitTypeSupply & Document
