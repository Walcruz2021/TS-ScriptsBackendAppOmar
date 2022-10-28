import { Document } from '@ioc:Mongoose'

export interface EiqRanges {
  type: TEiqRanges
  range: {
    min: number
    max: number
  }
}

export enum TEiqRanges {
  VERY_LOW = 'VERY_LOW',
  LOW = 'LOW',
  MODERATE = 'MODERATE',
  HIGH = 'HIGH',
  VERY_HIGH = 'VERY_HIGH'
}

export const collectionName = 'EiqRanges'

export type EiqRangesDocument = EiqRanges & Document
