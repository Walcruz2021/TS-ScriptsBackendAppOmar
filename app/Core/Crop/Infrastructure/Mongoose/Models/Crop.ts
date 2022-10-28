import { model } from '@ioc:Mongoose'
import { CropSchema } from '../Schemas/Crop'
import { CropDocument } from '../Interfaces'
export default model<CropDocument>('Crop', CropSchema)
