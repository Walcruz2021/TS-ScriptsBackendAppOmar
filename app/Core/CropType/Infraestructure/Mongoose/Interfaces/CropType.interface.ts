import { Document } from '@ioc:Mongoose'

export interface NameLanguageProps {
  es?: string
  en?: string
  pt?: string
}

export interface CropType {
  name: NameLanguageProps
  key: string
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface ICropTypeProps {
  _id?: string
  key: string
}

export type CropTypeDocument = CropType & Document
