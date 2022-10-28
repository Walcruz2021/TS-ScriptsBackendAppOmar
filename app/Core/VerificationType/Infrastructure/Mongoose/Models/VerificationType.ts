import { model } from '@ioc:Mongoose'
import { VerificationTypeDocument } from '../Interfaces'
import { VerificationTypeSchema } from '../Schemas/VerificationType'

export default model<VerificationTypeDocument>(
  'VerificationType',
  VerificationTypeSchema
)
