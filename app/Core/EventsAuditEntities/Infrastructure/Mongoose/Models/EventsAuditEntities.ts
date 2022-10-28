import { model } from '@ioc:Mongoose'
import { EventsAuditEntitiesDocument } from '../Interfaces'
import { EventsAuditEntitiesSchema } from '../Schemas/EventsAuditEntities'

export default model<EventsAuditEntitiesDocument>(
  'EventsAuditEntities',
  EventsAuditEntitiesSchema
)
