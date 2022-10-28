import { Document } from '@ioc:Mongoose'
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

export interface SuppliesMapper {
  _id: any
  name?: string
  unit?: string
  quantity?: number
  typeId?: string
  icon?: string
  total?: number
  eiqTotal?: number
  supply?: any
}

export interface Destination {
  name?: string
  unit?: string
  quantity?: number
  typeId?: string
  icon?: string
  total?: number
}

export interface Lots {}

export interface LotsWithSurface {
  tag?: string
  lot?: object
  surfacePlanned?: number
  surfaceAchievement?: number
}

export interface Achievement {
  _id: string | any
  envImpactIndex: string
  key: string
  dateAchievement?: Date
  surface?: number
  percent?: number
  eiq?: number
  supplies: Array<Supplies>
  destination?: Array<Destination>
  signers: Array<Signer>
  synchronizedList?: Array<{ service: string; isSynchronized: boolean }>
  eiqSurface?: number
  lots?: Lots[]
  lotsWithSurface?: LotsWithSurface[]
  company: string
  crop: string
  activity: string
  isRejected: boolean
}

export type AchievementDocument = Achievement & Document
