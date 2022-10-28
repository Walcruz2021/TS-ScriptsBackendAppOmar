import { model } from '@ioc:Mongoose'
import { UserSchema } from '../Schemas/User'
import { UserDocument } from 'App/Core/User/Infrastructure/Mongoose/Interfaces/User.interface'

export default model<UserDocument>('User', UserSchema)
