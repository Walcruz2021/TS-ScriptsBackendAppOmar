import { model } from '@ioc:Mongoose'
import { NormativeConfigDocument } from '../Interfaces'
import { NormativeConfigSchema } from '../Schemas/NormativeConfig'

export default model<NormativeConfigDocument>(
  'NormativeConfig',
  NormativeConfigSchema
)
