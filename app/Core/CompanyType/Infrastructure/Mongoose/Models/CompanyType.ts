import { model } from '@ioc:Mongoose'
import { CompanyTypeSchema } from 'App/Core/CompanyType/Infrastructure/Mongoose/Schemas/CompanyType'
import { CompanyTypeDocument } from 'App/Core/CompanyType/Infrastructure/Mongoose/Interfaces/CompanyType.interface'

export default model<CompanyTypeDocument>('CompanyType', CompanyTypeSchema)
