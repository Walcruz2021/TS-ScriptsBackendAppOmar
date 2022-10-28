import UnitTypeSupply from 'App/Core/UnitTypeSupply/Infrastructure/Mongoose/Models/UnitTypeSupply'
import UnitTypeSupplyRepo from 'App/Core/UnitTypeSupply/Infrastructure/Mongoose/Repositories/UnitTypeSupplyRepository'

const UnitTypeSupplyRepository = new UnitTypeSupplyRepo(UnitTypeSupply)
export default UnitTypeSupplyRepository
