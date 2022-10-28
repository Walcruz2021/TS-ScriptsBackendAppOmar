import { Document } from '@ioc:Mongoose'

export interface LandscapeSustainability {
  _id?: string
  crop: string
  lot: string
  totals: ITotalsProps
  generalCountryNormative: boolean
  datasets: Array<IFieldDataset>
  evidence: Array<IEvidence>
  nameSchema: string
  error?: boolean
  codeError?: string
  descriptionError?: string
  createdAt?: string
  updatedAt?: string
}

// eslint-disable-next-line @typescript-eslint/naming-convention
interface ITotalsProps {
  availableArea: Number
  totalAreaOfIntersections: Number
  fieldArea: Number
  percentageOfTheTotalInterceptionArea: Number
}

// eslint-disable-next-line @typescript-eslint/naming-convention
interface IFieldDataset {
  name: string
  percent: number
  intersectArea: number
}

// eslint-disable-next-line @typescript-eslint/naming-convention
interface IEvidence {
  name: String
  description: String
  url: String
  format: String
}

export const collectionName = 'LandscapeSustainability'

export type LandscapeSustainabilityDocument = LandscapeSustainability & Document
