import { Document } from '@ioc:Mongoose'

export interface Supply {
  _id?: string
  name: string
  company: string
  code: string
  alphaCode: string
  countryId?: string
  typeId?: string
  unit?: string
  brand?: string
  compositon?: string
  quantity?: number
  activeIngredients?: Array<any>
  supply?: string | any
  icon?: string
  total?: number | number
  eiqTotal?: number | number
  supplyType?: string
  unitTypeSupply?: string
  classToxic?: string
  createdAt?: string
  updatedAt?: string
}

export enum StateUsaSuppliesCdm {
  Liquid = 'Lts',
  Dry = 'Kgs',
  Granular = 'Kgs'
}

export const collectionName = 'supplies'

export type SupplyDocument = Supply & Document
