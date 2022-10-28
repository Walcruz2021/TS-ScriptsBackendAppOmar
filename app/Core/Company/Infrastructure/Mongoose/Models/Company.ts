import { model } from '@ioc:Mongoose'
import { CompanySchema } from '../Schemas/Company'
import { CompanyDocument } from '../Interfaces'

export default model<CompanyDocument>('Company', CompanySchema)
