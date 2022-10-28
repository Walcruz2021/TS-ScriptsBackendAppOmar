import { model } from '@ioc:Mongoose'
import { UnitTypeDocument } from '../Interfaces'
import { UnitTypeSchema } from '../Schemas/UnitType'

export default model<UnitTypeDocument>('UnitType', UnitTypeSchema)
