import { Document } from '@ioc:Mongoose'

export interface NormativeConfig {
  _id?: string
  alphaCode: string
  cropsType: Array<string>
  normative: string
  dateReference: string
  createdAt?: string
  updatedAt?: string
}

export const collectionName = 'NormativeConfig'

export type NormativeConfigDocument = NormativeConfig & Document
