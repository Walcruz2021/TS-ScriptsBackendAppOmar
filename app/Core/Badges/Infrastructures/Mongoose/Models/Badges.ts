import { model } from '@ioc:Mongoose'
import { BadgeSchema } from '../Schemas/Badges'
import { BadgeDocument } from '../Interfaces'

export default model<BadgeDocument>('Badges', BadgeSchema)
