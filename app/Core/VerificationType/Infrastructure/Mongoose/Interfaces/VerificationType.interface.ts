import { Document } from '@ioc:Mongoose'
import { ICompanyProps } from 'App/Core/Company/Infrastructure/Mongoose/Interfaces/Company.interface'
import { ICropTypeProps } from 'App/Core/CropType/Infraestructure/Mongoose/Interfaces/CropType.interface'

export interface VerificationType {
  key: string
  name: VerificationTypeName
  image?: string
  cropTypes: Array<CropType>
  companies: Array<Company>
}
export type VerificationTypeName = {
  en?: string
  es?: string
  pt?: string
}

export type CropType = {
  key: string
  cropType: string
}

export type Company = {
  company: string
  image: string
  identifier: string
  name: string
  availableCropTypes: Array<string>
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface IVerificationTypeProps {
  cropTypes: string[] | TypeVerificationCropTypes[]
  companies: string[] | TypeVerificationCompanies[]
  key: string
  name: {
    es: string
    en: string
    pt: string
  }
}

export type TypeVerificationCropTypes = {
  cropType: string | ICropTypeProps
  key?: string
}

export type TypeVerificationCompanies = {
  company: string | ICompanyProps
  image?: string
  identifier?: string
  name?: string
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface IVerifierCompanies {
  id_license: string
  verifierCompany: string
  verifierUsers: string
}
export type VerificationTypeDocument = VerificationType & Document
