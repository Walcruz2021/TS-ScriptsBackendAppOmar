import { Document } from '@ioc:Mongoose'

export interface CompanyType {
  _id?: string
  name: string
}

export type CompanyTypeDocument = CompanyType & Document
