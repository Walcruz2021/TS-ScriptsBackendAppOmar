import { EnvImpactIndexRepositoryContract } from '../../Contracts'
import { EnvImpactIndexDocument } from '../Interfaces'

export default class EnvImpactIndexRepository
  implements EnvImpactIndexRepositoryContract
{
  constructor(private envImpactIndexModel) {}
  public async count<Object>(query: Object): Promise<any> {
    return this.envImpactIndexModel.find(query).count()
  }
  public async create<EnvImpactIndex>(
    data: EnvImpactIndex
  ): Promise<EnvImpactIndexDocument> {
    return this.envImpactIndexModel.create(data)
  }
  public async findAll<Object>(
    query: Object
  ): Promise<EnvImpactIndexDocument[]> {
    return this.envImpactIndexModel.find(query)
  }
  public async findOne<Object>(query: Object): Promise<EnvImpactIndexDocument> {
    return this.envImpactIndexModel.findOne(query)
  }
  public async findOneAndUpdate<Object>(
    query: Object,
    querySet: Object
  ): Promise<any> {
    return this.envImpactIndexModel.findOneAndUpdate(query, querySet)
  }

  public async findByCursor<Object>(
    query: Object
  ): Promise<Iterator<EnvImpactIndexDocument>> {
    return this.envImpactIndexModel.find(query).cursor()
  }
  public async deleteOne<Object>(query: Object): Promise<any> {
    return this.envImpactIndexModel.deleteOne(query)
  }
}
