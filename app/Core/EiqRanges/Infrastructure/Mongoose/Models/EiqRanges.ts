import { model } from '@ioc:Mongoose'
import { EiqRangesDocument } from '../Interfaces'
import { EiqRangesSchema } from '../Schemas/EiqRanges'

export default model<EiqRangesDocument>('EiqRanges', EiqRangesSchema)
