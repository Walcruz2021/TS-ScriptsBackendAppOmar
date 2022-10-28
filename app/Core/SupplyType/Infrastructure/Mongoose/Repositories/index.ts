import SupplyType from 'App/Core/SupplyType/Infrastructure/Mongoose/Models/SupplyType'
import SupplyTypeRepo from 'App/Core/SupplyType/Infrastructure/Mongoose/Repositories/SupplyTypeRepository'

const SupplyTypeRepository = new SupplyTypeRepo(SupplyType)
export default SupplyTypeRepository
