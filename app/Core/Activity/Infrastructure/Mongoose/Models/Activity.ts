import { model } from '@ioc:Mongoose'
import { ActivitySchema } from '../Schemas/Activity'
import { ActivityDocument } from '../Interfaces'

export default model<ActivityDocument>('Activity', ActivitySchema)
