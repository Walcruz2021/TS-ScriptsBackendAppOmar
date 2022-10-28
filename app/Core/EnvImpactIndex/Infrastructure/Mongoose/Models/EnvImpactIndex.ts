import { model } from '@ioc:Mongoose'
import { EnvImpactIndexDocument } from '../Interfaces'
import { EnvImpactIndexSchema } from '../Schemas/EnvImpactIndex'

export default model<EnvImpactIndexDocument>(
  'EnvImpactIndex',
  EnvImpactIndexSchema
)
