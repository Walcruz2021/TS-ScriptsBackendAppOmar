import SubTypeActivity from 'App/Core/SubTypeActivity/Infrastructure/Mongoose/Models/SubTypeActivity'
import SubTypeActivityRepo from 'App/Core/SubTypeActivity/Infrastructure/Mongoose/Repositories/SubTypeActivityRepository'

const SubTypeActivityRepository = new SubTypeActivityRepo(SubTypeActivity)
export default SubTypeActivityRepository
