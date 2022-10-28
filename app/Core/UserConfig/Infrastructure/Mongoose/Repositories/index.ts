import UserConfig from 'App/Core/UserConfig/Infrastructure/Mongoose/Models/UserConfig'
import UserConfigRepo from 'App/Core/UserConfig/Infrastructure/Mongoose/Repositories/UserConfigRepository'

const UserConfigRepository = new UserConfigRepo(UserConfig)
export default UserConfigRepository
