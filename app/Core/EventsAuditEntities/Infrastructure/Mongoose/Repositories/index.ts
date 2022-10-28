import EventsAuditEntities from 'App/Core/EventsAuditEntities/Infrastructure/Mongoose/Models/EventsAuditEntities'
import EventsAuditEntitiesRepo from 'App/Core/EventsAuditEntities/Infrastructure/Mongoose/Repositories/EventsAuditEntitiesRepository'

const EventsAuditEntitiesRepository = new EventsAuditEntitiesRepo(
  EventsAuditEntities
)
export default EventsAuditEntitiesRepository
