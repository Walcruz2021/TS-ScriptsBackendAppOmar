import Rol from 'App/Core/Rol/Infrastructure/Mongoose/Models/Rol'
import RolRepo from 'App/Core/Rol/Infrastructure/Mongoose/Repositories/RolRepository'

const RolRepository = new RolRepo(Rol)
export default RolRepository
