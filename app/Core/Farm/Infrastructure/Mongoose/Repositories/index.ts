import Farm from 'App/Core/Farm/Infrastructure/Mongoose/Models/Farm'
import FarmRepo from 'App/Core/Farm/Infrastructure/Mongoose/Repositories/FarmRepository'

const FarmRepository = new FarmRepo(Farm)

export default FarmRepository
