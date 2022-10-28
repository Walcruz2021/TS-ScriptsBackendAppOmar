import FileLogLot from 'App/Core/FilelogLot/Infrastructure/Mongoose/Models/FileLogLot'
import FileLogLotRepo from 'App/Core/FilelogLot/Infrastructure/Mongoose/Repositories/FileLogLotRepository'

const FileLogLotRepository = new FileLogLotRepo(FileLogLot)
export default FileLogLotRepository
