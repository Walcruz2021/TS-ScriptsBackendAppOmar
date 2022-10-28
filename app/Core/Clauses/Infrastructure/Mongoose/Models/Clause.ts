import { model } from '@ioc:Mongoose'
import { ClauseDocument } from '../Interfaces'
import { ClauseSchema } from '../Schemas/Clause'

export default model<ClauseDocument>('Clause', ClauseSchema)
