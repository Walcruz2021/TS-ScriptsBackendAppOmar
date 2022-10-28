import { model } from '@ioc:Mongoose'
import { UserConfigSchema } from '../Schemas/UserConfig'
import { UserConfigDocument } from 'App/Core/UserConfig/Infrastructure/Mongoose/Interfaces'

export default model<UserConfigDocument>('UserConfig', UserConfigSchema)
