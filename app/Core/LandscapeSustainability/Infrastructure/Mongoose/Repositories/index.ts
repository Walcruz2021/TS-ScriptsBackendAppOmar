import LandscapeSustainability from 'App/Core/LandscapeSustainability/Infrastructure/Mongoose/Models/LandscapeSustainability'
import LandscapeSustainabilityRepo from 'App/Core/LandscapeSustainability/Infrastructure/Mongoose/Repositories/LandscapeSustainabilityRepository'

const LandscapeSustainabilityRepository = new LandscapeSustainabilityRepo(
  LandscapeSustainability
)
export default LandscapeSustainabilityRepository