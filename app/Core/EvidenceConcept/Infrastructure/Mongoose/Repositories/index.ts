import EvidenceConcept from 'App/Core/EvidenceConcept/Infrastructure/Mongoose/Models/EvidenceConcept'
import EvidenceConceptRepo from 'App/Core/EvidenceConcept/Infrastructure/Mongoose/Repositories/EvidenceConceptRepository'

const EvidenceConceptRepository = new EvidenceConceptRepo(EvidenceConcept)
export default EvidenceConceptRepository
