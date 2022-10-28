import { model } from '@ioc:Mongoose'
import { SignedLicenseDocument } from '../Interfaces'
import { SignedLicenseSchema } from '../Schemas/SignedLicense'

export default model<SignedLicenseDocument>(
  'SignedLicenses',
  SignedLicenseSchema
)
