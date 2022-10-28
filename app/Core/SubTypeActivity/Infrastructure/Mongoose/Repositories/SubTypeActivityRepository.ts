import { SubTypeActivityRepositoryContract } from '../../Contracts'
import { SubTypeActivityDocument } from '../Interfaces'

export default class SubTypeActivityRepository
  implements SubTypeActivityRepositoryContract
{
  constructor(private subTypeActivityModel) {}
  public async count<Object>(query: Object): Promise<any> {
    return this.subTypeActivityModel.find(query).count()
  }
  public async create<Achievement>(
    data: Achievement
  ): Promise<SubTypeActivityDocument> {
    return this.subTypeActivityModel.create(data)
  }
  public async findAll<Object>(
    query: Object
  ): Promise<SubTypeActivityDocument[]> {
    return this.subTypeActivityModel.find(query)
  }
  public async findOne<Object>(
    query: Object
  ): Promise<SubTypeActivityDocument> {
    return this.subTypeActivityModel.findOne(query)
  }
  public async findOneAndUpdate<Object>(
    query: Object,
    querySet: Object
  ): Promise<any> {
    return this.subTypeActivityModel.findOneAndUpdate(query, querySet)
  }

  public async findByCursor<Object>(
    query: Object
  ): Promise<Iterator<SubTypeActivityDocument>> {
    return this.subTypeActivityModel.find(query).cursor()
  }
  public async deleteOne<Object>(query: Object): Promise<any> {
    return this.subTypeActivityModel.deleteOne(query)
  }
}
