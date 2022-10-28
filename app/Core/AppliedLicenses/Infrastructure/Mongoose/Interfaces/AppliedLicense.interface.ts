import { Document } from '@ioc:Mongoose'
export interface AppliedLicense {
  licenseId: string
  cropId: string | any
  userId: string | any
  lots: string[] | any
  appliedSurface: number
  companyId: string
}

export const collectionName = 'AppliedLicenses'

export type AppliedLicenseDocument = AppliedLicense & Document
