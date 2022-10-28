import { model } from '@ioc:Mongoose'
import { AchievementSchema } from '../Schemas/Achievement'
import { AchievementDocument } from '../Interfaces'

export default model<AchievementDocument>('Achievement', AchievementSchema)
