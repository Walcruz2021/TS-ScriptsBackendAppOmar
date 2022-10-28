import { model } from '@ioc:Mongoose'
import { ActivityTypeSchema } from '../Schemas/ActivityType'
import { ActivityTypeDocument } from '../Interfaces'

export default model<ActivityTypeDocument>('ActivityType', ActivityTypeSchema)
