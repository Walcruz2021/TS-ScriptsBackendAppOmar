import { Document } from '@ioc:Mongoose'

export interface EvidenceConcept {
  _id?: string
  code: string
  name: NameLanguageProps
  createdAt?: string
  updatedAt?: string
}

export interface NameLanguageProps {
  es?: string
  en?: string
  pt?: string
}

export const collectionName = 'EvidenceConcept'

export type EvidenceConceptDocument = EvidenceConcept & Document
