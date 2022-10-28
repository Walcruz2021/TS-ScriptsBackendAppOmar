import { model } from '@ioc:Mongoose'
import { ActiveIngredientDocument } from '../Interfaces'
import { ActiveIngredientSchema } from '../Schemas/ActiveIngredient'

export default model<ActiveIngredientDocument>(
  'ActiveIngredient',
  ActiveIngredientSchema
)
