import User from 'App/Core/User/Infrastructure/Mongoose/Models/User'
import UserRepo from 'App/Core/User/Infrastructure/Mongoose/Repositories/UserRepository'

const UserRepository = new UserRepo(User)
export default UserRepository
