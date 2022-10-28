import { model } from '@ioc:Mongoose'
import { SupplyTypeDocument } from '../Interfaces'
import { SupplyTypeSchema } from '../Schemas/SupplyType'

export default model<SupplyTypeDocument>('SupplyType', SupplyTypeSchema)
