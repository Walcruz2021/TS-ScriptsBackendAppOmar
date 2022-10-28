import { FlagRepositoryContract } from '../../Contracts'
import { FlagDocument } from '../Interfaces'

class FlagRepository implements FlagRepositoryContract {
  constructor(private FlagModel) {}
  public async count<Object>(query: Object): Promise<any> {
    return this.FlagModel.find(query).count()
  }
  public async create<Flag>(data: Flag): Promise<FlagDocument> {
    return this.FlagModel.create(data)
  }
  public async findAll<Object>(query: Object): Promise<FlagDocument[]> {
    return this.FlagModel.find(query)
  }
  public async findOne<Object>(query: Object): Promise<FlagDocument> {
    return this.FlagModel.findOne(query)
  }
  public async findOneAndUpdate<Object>(
    query: Object,
    querySet: Object
  ): Promise<any> {
    return this.FlagModel.findOneAndUpdate(query, querySet)
  }

  public async findByCursor<Object>(
    query: Object
  ): Promise<Iterator<FlagDocument>> {
    return this.FlagModel.find(query).cursor()
  }
}

export { FlagRepository }
