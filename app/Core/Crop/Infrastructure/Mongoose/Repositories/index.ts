import Crop from 'App/Core/Crop/Infrastructure/Mongoose/Models/Crop'
import CropRepo from 'App/Core/Crop/Infrastructure/Mongoose/Repositories/CropRepository'

const CropRepository = new CropRepo(Crop)
export default CropRepository
