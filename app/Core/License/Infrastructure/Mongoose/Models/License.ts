import { model } from '@ioc:Mongoose'
import { LicenseDocument } from '../Interfaces'
import { LicenseSchema } from '../Schemas/License'

export default model<LicenseDocument>('Licenses', LicenseSchema)
