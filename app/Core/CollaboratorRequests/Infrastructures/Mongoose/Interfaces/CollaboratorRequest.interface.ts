import { Document } from '@ioc:Mongoose'
import { StateCollaboratorRequestTypes } from '../Enums'

export interface CollaboratorRequest {
  _id: string
  status: StateCollaboratorRequestTypes
  company: string
  user: string
}

export type CollaboratorRequestDocument = CollaboratorRequest & Document
