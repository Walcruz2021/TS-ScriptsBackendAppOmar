import { model } from '@ioc:Mongoose'
import { FlagSchema } from '../Schemas/Flag'
import { FlagDocument } from '../Interfaces'

export default model<FlagDocument>('Flag', FlagSchema)
