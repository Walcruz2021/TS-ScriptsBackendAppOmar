import { ClauseRepositoryContract } from '../../Contracts'
import { ClauseDocument } from '../Interfaces'

export default class ClauseRepository implements ClauseRepositoryContract {
  constructor(private clauseModel) {}
  public async count<Object>(query: Object): Promise<any> {
    return this.clauseModel.find(query).count()
  }
  public async create<Clause>(data: Clause): Promise<ClauseDocument> {
    return this.clauseModel.create(data)
  }
  public async findAll<Object>(query: Object): Promise<ClauseDocument[]> {
    return this.clauseModel.find(query)
  }
  public async findOne<Object>(query: Object): Promise<ClauseDocument> {
    return this.clauseModel.findOne(query).lean()
  }
  public async findOneAndUpdate<Object>(
    query: Object,
    querySet: Object
  ): Promise<any> {
    return this.clauseModel.findOneAndUpdate(query, querySet)
  }

  public async findByCursor<Object>(
    query: Object
  ): Promise<Iterator<ClauseDocument>> {
    return this.clauseModel.find(query).cursor()
  }
  public async deleteOne<Object>(query: Object): Promise<any> {
    return this.clauseModel.deleteOne(query)
  }
}
