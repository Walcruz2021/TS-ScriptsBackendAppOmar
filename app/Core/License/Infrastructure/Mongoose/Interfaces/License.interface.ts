import { Document } from '@ioc:Mongoose'
import { ICompanyProps } from 'App/Core/Company/Infrastructure/Mongoose/Interfaces/Company.interface'
import { IFileProps } from 'App/Core/FileDocument/Infrastructure/Mongoose/Interfaces/FileDocument.interface'
import { IUserProps } from 'App/Core/User/Infrastructure/Mongoose/Interfaces/User.interface'
import { IVerificationTypeProps } from 'App/Core/VerificationType/Infrastructure/Mongoose/Interfaces/VerificationType.interface'

export interface License {
  name: string
  slug?: string
  type: LicenseTypes
  previewDescription: string
  countryId: string
  cropType: string
  companyId: string
  companyIdentifier?: string
  termsAndConditions: string
  clauses: string[]
  accessibleIdentifier?: string[]
  inaccessibleIdentifier?: string[]
  startDatePost: Date
  endDatePost: Date
  startDate: Date
  endDate: Date
  companyUsers: string[]
  userViewCounter?: number
  status?: LicenseStatus
  state?: LicenseState
  hectareLimit: number
  hectareMinIdentifier?: number
  hectareLimitIdentifier?: number
  timeLeftPost: number
  timeLeftNew: number
  hectareUsedCounter?: number
  hectareLeftPercentage: number
  image: string
  imageOriginal?: IFileProps
  imageIntermediate?: IFileProps
  imageThumbnail?: IFileProps
  normative?: string
  allowIntersection?: AllowIntersection
  fieldsHash?: string
  subLicenses?: string[]
  verifierCompanies?: TypeVerifierCompanies[]
  verificationType?: string | IVerificationTypeProps
  idLicense?: string
}

export enum LicenseTypes {
  SUSTAINABILITY = 'SUSTAINABILITY',
  CERTIFICATIONS = 'CERTIFICATIONS',
  FINANCING = 'FINANCING',
  TRACEABILITY = 'TRACEABILITY'
}

export enum LicenseStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  EXPIRED = 'EXPIRED'
}

export enum LicenseState {
  NONE = 'NONE',
  NEW = 'NEW',
  SIGNED = 'SIGNED',
  APPLIED = 'APPLIED'
}

export enum LicenseStateOther {
  SHORT_HAS = 'SHORT_HAS',
  SHORT_TIME = 'SHORT_TIME',
  NEW_COMPANY = 'NEW_COMPANY',
  SELECT_COMPANY = 'SELECT_COMPANY'
}

export enum AllowIntersection {
  NONE = '',
  NOT = 'NOT',
  YES = 'YES',
  YES_MAX = 'YES_MAX'
}

export type TypeVerifierCompanies = {
  company: string | ICompanyProps
  verifierUsers: TypeVerifierUsers[]
}

export type TypeVerifierUsers = {
  user: string | IUserProps
  identifier: string
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface ILicencesInExcelDTO {
  id_license: number
  countryId: string
  title_clauses: string
  name: string
  type: string
  previewDescription: string
  taxId: string
  cropType: string
  image: string
  termsAndConditions: string
  accessibleIdentifier: string
  InaccessibleIdentifier: string
  startDatePost: string
  endDatePost: string
  startDate: string
  endDate: string
  companyUsers: string
  status: string
  hectareLimit: number
  hectareLimitIdentifier: number
  hectareMinIdentifier: number
  timeLeftPost: number
  timeLeftNew: number
  hectareLeftPercentage: number
  normative: string
  allowIntersection: string
  verificationType?: string
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface ILicenseProps {
  name: string
  slug?: string
  type: LicenseTypes
  previewDescription: string
  countryId: string
  cropType: string
  companyId: string
  companyIdentifier?: string
  termsAndConditions: string
  clauses: string[]
  accessibleIdentifier?: string[]
  inaccessibleIdentifier?: string[]
  startDatePost: Date
  endDatePost: Date
  startDate: Date
  endDate: Date
  companyUsers: string[]
  userViewCounter?: number
  status?: LicenseStatus
  state?: LicenseState
  hectareLimit: number
  hectareMinIdentifier?: number
  hectareLimitIdentifier?: number
  timeLeftPost: number
  timeLeftNew: number
  hectareUsedCounter?: number
  hectareLeftPercentage: number
  image: string
  imageOriginal?: IFileProps
  imageIntermediate?: IFileProps
  imageThumbnail?: IFileProps
  normative?: string
  allowIntersection?: AllowIntersection
  fieldsHash?: string
  subLicenses?: string[]
  verifierCompanies?: TypeVerifierCompanies[]
  verificationType?: string | IVerificationTypeProps
}

export interface CreateLicenseDTO {
  name: string
  type: LicenseTypes
  previewDescription: string
  companyId: string | any
  companyIdentifier: string
  cropType: string | any
  termsAndConditions: string
  clauses: string[]
  accessibleIdentifier?: string[]
  inaccessibleIdentifier?: string[]
  startDatePost: Date
  endDatePost: Date
  startDate: Date
  endDate: Date
  companyUsers?: string[]
  status?: LicenseStatus
  hectareLimit: number
  hectareMinIdentifier: number
  hectareLimitIdentifier: number
  timeLeftPost: number
  timeLeftNew: number
  hectareLeftPercentage: number
  image?: string
  countryId: string | any
  normative?: string
  allowIntersection?: string
  fieldsHash?: string
  verifierCompanies?: CreateVerifierCompaniesDTO[]
  verificationType?: string
  idLicense?: number
}

export interface CreateVerifierUsersDTO {
  _id?: string
  identifier: string
  user: string
}
export interface CreateVerifierCompaniesDTO {
  company: string
  verifierUsers: CreateVerifierUsersDTO[]
}

export const collectionName = 'Licenses'

export type LicenseDocument = License & Document
