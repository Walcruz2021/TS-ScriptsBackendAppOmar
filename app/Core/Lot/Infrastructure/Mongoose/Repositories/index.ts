import Lot from 'App/Core/Lot/Infrastructure/Mongoose/Models/Lot'
import LotRepo from 'App/Core/Lot/Infrastructure/Mongoose/Repositories/LotRepository'

const LotRepository = new LotRepo(Lot)
export default LotRepository
