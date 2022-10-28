import { model } from '@ioc:Mongoose'
import { CollectionVersionDocument } from '../Interfaces'
import { CollectionVersionSchema } from '../Schemas/CollectionVersion'

export default model<CollectionVersionDocument>(
  'CollectionVersion',
  CollectionVersionSchema
)
