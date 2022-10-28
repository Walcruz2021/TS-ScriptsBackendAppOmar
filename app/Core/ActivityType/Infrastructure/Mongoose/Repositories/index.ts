import ActivityType from 'App/Core/ActivityType/Infrastructure/Mongoose/Models/ActivityType'
import ActivityTypeRepo from 'App/Core/ActivityType/Infrastructure/Mongoose/Repositories/ActivityTypeRepository'

const ActivityTypeRepository = new ActivityTypeRepo(ActivityType)
export default ActivityTypeRepository
