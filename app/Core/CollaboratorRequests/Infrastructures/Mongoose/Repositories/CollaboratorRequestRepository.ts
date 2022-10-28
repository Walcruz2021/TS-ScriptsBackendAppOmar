import { CollaboratorRequestRepositoryContract } from '../../Contracts'
import { CollaboratorRequestDocument } from '../Interfaces'

export default class CollaboratorRequestRepository
  implements CollaboratorRequestRepositoryContract
{
  constructor(private CollaboratorRequestModel) {}
  public async count<Object>(query: Object): Promise<any> {
    return this.CollaboratorRequestModel.find(query).count()
  }

  public async create<CollaboratorRequest>(
    data: CollaboratorRequest
  ): Promise<CollaboratorRequestDocument> {
    return this.CollaboratorRequestModel.create(data)
  }

  public async findAll<Object>(
    query: Object
  ): Promise<CollaboratorRequestDocument[]> {
    return this.CollaboratorRequestModel.find(query)
  }

  public async findOne<Object>(
    query: Object
  ): Promise<CollaboratorRequestDocument> {
    return this.CollaboratorRequestModel.findOne(query).lean()
  }

  public async findOneAndUpdate<Object>(
    query: Object,
    querySet: Object
  ): Promise<any> {
    return this.CollaboratorRequestModel.findOneAndUpdate(query, querySet)
  }

  public async findByCursor<Object>(
    query: Object
  ): Promise<Iterator<CollaboratorRequestDocument>> {
    return this.CollaboratorRequestModel.find(query).cursor()
  }

  public async deleteOne<Object>(query: Object): Promise<any> {
    return this.CollaboratorRequestModel.deleteOne(query)
  }

  public async deleteMany<Object>(query: Object): Promise<any> {
    return this.CollaboratorRequestModel.deleteMany(query)
  }
}
