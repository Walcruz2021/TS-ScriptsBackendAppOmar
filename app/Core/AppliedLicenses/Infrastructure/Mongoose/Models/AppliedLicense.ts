import { model } from '@ioc:Mongoose'
import { AppliedLicenseDocument } from '../Interfaces'
import { AppliedLicenseSchema } from '../Schemas/AppliedLicense'

export default model<AppliedLicenseDocument>(
  'AppliedLicense',
  AppliedLicenseSchema
)
