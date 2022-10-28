import { ObjectId, Document } from '@ioc:Mongoose'
import { Signer } from 'App/Core/Signer/Infrastructure/Mongoose/Interfaces'

export interface Supplies {
  _id: any
  name?: string
  unit?: string
  quantity?: number
  typeId?: string
  icon?: string
  total?: number
  eiqTotal?: number
  supply?: any
  brand?: string
  code?: string
}

export interface Activity {
  _id?: string | ObjectId | any
  id: string
  key: string
  name?: string
  dateStart: Date
  dateEnd: Date
  dateHarvest: Date
  dateLimitValidation: Date
  dateObservation: Date
  dateEstimatedHarvest: Date
  observation: string
  unitType: string
  envImpactIndex: any
  pay: number
  surface: number
  status: any
  signers: Array<Signer>
  approvalRegister: any
  type: any
  typeAgreement: any
  lots: any[]
  lotsWithSurface?: any[]
  lotsMade: any[]
  supplies: any[]
  storages: any[]
  files: any[]
  achievements: any[]
  user: string
  isSynchronized: boolean
  company: string
  crop: string
}

export type ActivityDocument = Activity & Document
