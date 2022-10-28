import NormativeConfig from 'App/Core/NormativeConfig/Infrastructure/Mongoose/Models/NormativeConfig'
import NormativeConfigRepo from 'App/Core/NormativeConfig/Infrastructure/Mongoose/Repositories/NormativeConfigRepository'

const NormativeConfigRepository = new NormativeConfigRepo(NormativeConfig)
export default NormativeConfigRepository
