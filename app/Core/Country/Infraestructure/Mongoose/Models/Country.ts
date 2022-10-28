import { model } from '@ioc:Mongoose'
import { CountrySchema } from '../Schemas/Country'
import { CountryDocument } from '../Interfaces'

export default model<CountryDocument>('Country', CountrySchema)
