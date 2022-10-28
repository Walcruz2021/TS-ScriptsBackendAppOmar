import { model } from '@ioc:Mongoose'
import { SubLicenseDocument } from '../Interfaces'
import { SubLicenseSchema } from '../Schemas/SubLicense'

export default model<SubLicenseDocument>('SubLicenses', SubLicenseSchema)
