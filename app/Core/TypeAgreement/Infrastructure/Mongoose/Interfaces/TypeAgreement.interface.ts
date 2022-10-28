import { Document } from '@ioc:Mongoose'

export interface TypeAgreement {
  _id?: string
  name: {
    en?: String
    es?: String
    pt?: String
  }
  key: String
  visible: String[]
}

export const collectionName = 'TypeAgreement'

export type TypeAgreementDocument = TypeAgreement & Document
