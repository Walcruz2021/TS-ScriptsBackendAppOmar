import { model } from '@ioc:Mongoose'
import { TypeAgreementDocument } from '../Interfaces'
import { TypeAgreementSchema } from '../Schemas/TypeAgreement'

export default model<TypeAgreementDocument>(
  'TypeAgreement',
  TypeAgreementSchema
)
