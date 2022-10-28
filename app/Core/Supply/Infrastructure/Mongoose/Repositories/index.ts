import Supply from 'App/Core/Supply/Infrastructure/Mongoose/Models/Supply'
import SupplyRepo from 'App/Core/Supply/Infrastructure/Mongoose/Repositories/SupplyRepository'

const SupplyRepository = new SupplyRepo(Supply)
export default SupplyRepository
