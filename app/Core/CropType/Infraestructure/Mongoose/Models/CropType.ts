import { model } from '@ioc:Mongoose'
import { CropTypeDocument } from '../Interfaces'
import { CropTypeSchema } from '../Schemas/CropType'
export default model<CropTypeDocument>('CropType', CropTypeSchema)
