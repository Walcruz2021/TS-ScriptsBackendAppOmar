import { model } from '@ioc:Mongoose'
import { SubTypeActivitySchema } from '../Schemas/SubTypeActivity'
import { SubTypeActivityDocument } from '../Interfaces'

export default model<SubTypeActivityDocument>(
  'SubTypeActivity',
  SubTypeActivitySchema
)
