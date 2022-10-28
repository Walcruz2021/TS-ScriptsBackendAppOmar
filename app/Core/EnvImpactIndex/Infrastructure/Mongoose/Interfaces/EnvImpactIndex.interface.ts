import { Document } from '@ioc:Mongoose'

export interface EnvImpactIndex {
  _id?: any
  readonly crop: String
  readonly lot?: String
  readonly activity: String
  readonly achievement?: String
  entity: IEntity
  eiq: Partial<IEiqProps>
}
export interface IEiqProps {
  value: Number
  planned: Number
  range: TEiqRanges
}
export enum IEntity {
  CROP = 'CROP',
  LOT = 'LOT',
  ACTIVITY = 'ACTIVITY',
  ACHIEVEMENT = 'ACHIEVEMENT'
}

export enum TEiqRanges {
  VERY_LOW = 'VERY_LOW',
  LOW = 'LOW',
  MODERATE = 'MODERATE',
  HIGH = 'HIGH',
  VERY_HIGH = 'VERY_HIGH'
}

export const collectionName = 'EnvImpactIndex'

export type EnvImpactIndexDocument = EnvImpactIndex & Document
