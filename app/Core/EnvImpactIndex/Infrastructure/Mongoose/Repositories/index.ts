import EnvImpactIndex from 'App/Core/EnvImpactIndex/Infrastructure/Mongoose/Models/EnvImpactIndex'
import EnvImpactIndexRepo from 'App/Core/EnvImpactIndex/Infrastructure/Mongoose/Repositories/EnvImpactIndexRepository'

const EnvImpactIndexRepository = new EnvImpactIndexRepo(EnvImpactIndex)
export default EnvImpactIndexRepository
