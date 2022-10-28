import { model } from '@ioc:Mongoose'
import { UnitTypeSupplyDocument } from '../Interfaces'
import { UnitTypeSupplySchema } from '../Schemas/UnitTypeSupply'

export default model<UnitTypeSupplyDocument>(
  'UnitTypeSupply',
  UnitTypeSupplySchema
)
