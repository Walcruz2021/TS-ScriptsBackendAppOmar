import CollaboratorRequest from 'App/Core/CollaboratorRequests/Infrastructures/Mongoose/Models/CollaboratorRequest'
import CollaboratorRequestRepo from 'App/Core/CollaboratorRequests/Infrastructures/Mongoose/Repositories/CollaboratorRequestRepository'

const CollaboratorRequestRepository = new CollaboratorRequestRepo(
  CollaboratorRequest
)
export default CollaboratorRequestRepository
