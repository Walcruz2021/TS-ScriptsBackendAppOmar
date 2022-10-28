import { model } from '@ioc:Mongoose'
import { LandscapeSustainabilityDocument } from '../Interfaces'
import { LandscapeSustainabilitySchema } from '../Schemas/LandscapeSustainability'

export default model<LandscapeSustainabilityDocument>(
  'LandscapeSustainabilitySchema',
  LandscapeSustainabilitySchema
)
