import UnitType from 'App/Core/UnitType/Infrastructure/Mongoose/Models/UnitType'
import UnitTypeRepo from 'App/Core/UnitType/Infrastructure/Mongoose/Repositories/UnitTypeRepository'

const UnitTypeRepository = new UnitTypeRepo(UnitType)
export default UnitTypeRepository
