import { model } from '@ioc:Mongoose'
import { EvidenceConceptDocument } from '../Interfaces'
import { EvidenceConceptSchema } from '../Schemas/EvidenceConcept'

export default model<EvidenceConceptDocument>(
  'EvidenceConcept',
  EvidenceConceptSchema
)
