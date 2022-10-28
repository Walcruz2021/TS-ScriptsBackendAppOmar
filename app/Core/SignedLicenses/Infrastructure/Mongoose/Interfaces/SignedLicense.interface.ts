import { Document } from '@ioc:Mongoose'
export interface SignedLicense {
  licenseId: string
  companyId: string
  userId: string
  fileKey: string
  timestamp: number
}

export const collectionName = 'SignedLicenses'

export type SignedLicenseDocument = SignedLicense & Document
