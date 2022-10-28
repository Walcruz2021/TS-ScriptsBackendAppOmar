import ActiveIngredient from 'App/Core/ActiveIngredient/Infrastructure/Mongoose/Models/ActiveIngredient'
import ActiveIngredientRepo from 'App/Core/ActiveIngredient/Infrastructure/Mongoose/Repositories/ActiveIngredientRepository'

const ActiveIngredientRepository = new ActiveIngredientRepo(ActiveIngredient)
export default ActiveIngredientRepository
