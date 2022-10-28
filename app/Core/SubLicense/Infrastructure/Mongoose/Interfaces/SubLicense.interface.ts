import { Document } from '@ioc:Mongoose'
import { IFileProps } from 'App/Core/FileDocument/Infrastructure/Mongoose/Interfaces/FileDocument.interface'

export enum SubLicenseStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  EXPIRED = 'EXPIRED'
}

export interface SubLicense {
  licenseId: string
  companyId: string
  companyIdentifier?: string
  accessibleIdentifier?: string[]
  inaccessibleIdentifier?: string[]
  companyUsers: string[]
  userViewCounter?: number
  status?: SubLicenseStatus
  hectareLimit: number
  hectareMinIdentifier?: number
  hectareLimitIdentifier?: number
  hectareUsedCounter?: number
  image?: string
  imageOriginal?: IFileProps
  imageIntermediate?: IFileProps
  imageThumbnail?: IFileProps
  idSublicense?: number
  fieldsHash?: string
  canApplyLots?: string[]
}
export interface ISubLicencesInExcelDTO {
  idLicense: number
  id_sublicense: number
  taxId: string
  image: string
  accessibleIdentifier: string
  InaccessibleIdentifier: string
  companyUsers: string
  status: string
  hectareLimit: number
  hectareLimitIdentifier: number
  hectareMinIdentifier: number
}

export interface CreateSubLicenseDTO {
  licenseId: string
  companyId: string | any
  status: SubLicenseStatus
  companyIdentifier: string
  accessibleIdentifier?: string[]
  inaccessibleIdentifier?: string[]
  companyUsers?: string[]
  hectareLimit: number
  hectareMinIdentifier: number
  hectareLimitIdentifier: number
  image?: string
  fieldsHash?: string
}

export interface CreateSubLicenseParamsDTO {
  id: string
}

export const collectionName = 'SubLicenses'

export type SubLicenseDocument = SubLicense & Document
