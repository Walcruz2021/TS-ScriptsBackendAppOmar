import EventAuditRepository from '../Mongoose/Repositories'
import { CreateEventAuditUseCase } from './createEventAudit/createEventAuditUseCase'

const createEventAuditUseCase = new CreateEventAuditUseCase(
  EventAuditRepository
)
export { createEventAuditUseCase }
