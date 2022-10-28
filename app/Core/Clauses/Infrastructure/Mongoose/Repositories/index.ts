import Clause from 'App/Core/Clauses/Infrastructure/Mongoose/Models/Clause'
import ClauseRepo from 'App/Core/Clauses/Infrastructure/Mongoose/Repositories/ClauseRepository'

const ClauseRepository = new ClauseRepo(Clause)
export default ClauseRepository
