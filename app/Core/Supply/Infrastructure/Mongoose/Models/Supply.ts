import { model } from '@ioc:Mongoose'
import { SupplyDocument } from '../Interfaces'
import { SupplySchema } from '../Schemas/Supply'

export default model<SupplyDocument>('Supply', SupplySchema)
