import Activity from 'App/Core/Activity/Infrastructure/Mongoose/Models/Activity'
import ActivityRepo from 'App/Core/Activity/Infrastructure/Mongoose/Repositories/ActivityRepository'

const ActivityRepository = new ActivityRepo(Activity)
export default ActivityRepository
