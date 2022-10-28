import { model } from '@ioc:Mongoose'
import { CollaboratorRequestSchema } from '../Schemas/CollaboratorRequest'
import { CollaboratorRequestDocument } from '../Interfaces'

export default model<CollaboratorRequestDocument>(
  'CollaboratorRequest',
  CollaboratorRequestSchema
)
