import { EvidenceConceptRepositoryContract } from '../../Contracts'
import { EvidenceConceptDocument } from '../Interfaces'

export default class EvidenceConceptRepository
  implements EvidenceConceptRepositoryContract
{
  constructor(private evidenceConceptModel) {}
  public async count<Object>(query: Object): Promise<any> {
    return this.evidenceConceptModel.find(query).count()
  }
  public async create<EvidenceConcept>(
    data: EvidenceConcept
  ): Promise<EvidenceConceptDocument> {
    return this.evidenceConceptModel.create(data)
  }
  public async findAll<Object>(
    query: Object
  ): Promise<EvidenceConceptDocument[]> {
    return this.evidenceConceptModel.find(query)
  }
  public async findOne<Object>(
    query: Object
  ): Promise<EvidenceConceptDocument> {
    return this.evidenceConceptModel.findOne(query)
  }
  public async findOneAndUpdate<Object>(
    query: Object,
    querySet: Object
  ): Promise<any> {
    return this.evidenceConceptModel.findOneAndUpdate(query, querySet)
  }

  public async findByCursor<Object>(
    query: Object
  ): Promise<Iterator<EvidenceConceptDocument>> {
    return this.evidenceConceptModel.find(query).cursor()
  }
  public async deleteOne<Object>(query: Object): Promise<any> {
    return this.evidenceConceptModel.deleteOne(query)
  }

  public async update<Object>(query: Object, querySet: Object): Promise<any> {
    return this.evidenceConceptModel.update(query, querySet)
  }
}
