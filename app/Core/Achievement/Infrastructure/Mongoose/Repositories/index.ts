import Achievement from 'App/Core/Achievement/Infrastructure/Mongoose/Models/Achievement'
import AchievementRepo from 'App/Core/Achievement/Infrastructure/Mongoose/Repositories/AchievementRepository'

const AchievementRepository = new AchievementRepo(Achievement)
export default AchievementRepository
