import { FarmRepositoryContract } from '../../Contracts'

export default class FarmRepository implements FarmRepositoryContract {
  constructor(private FarmModel) {}

  public async findAll<Object>(query: Object): Promise<any> {
    return this.FarmModel.find(query)
  }

  public async findOneId<Object>(query: Object): Promise<any> {
    return this.FarmModel.findOne(query).select('_id').lean()
  }

  public async findOne<Object>(query: Object): Promise<any> {
    return this.FarmModel.findOne(query)
  }

  public async create<Object>(data: Object): Promise<any> {
    return this.FarmModel.create(data)
  }

  public async updateOne<Object>(query: Object, data): Promise<any> {
    return this.FarmModel.updateOne(query, data)
  }

  public async findOneAndUpdate<T>(query: T, querySet: T): Promise<any> {
    return this.FarmModel.findOneAndUpdate(query, querySet)
  }

  public async replaceOne<T>(query: T, dataToUpdate: T): Promise<any> {
    return this.FarmModel.replaceOne(query, dataToUpdate)
  }

  public async dropCollection(): Promise<any> {
    return this.FarmModel.collection.drop()
  }

  public async deleteOne<Object>(query: Object): Promise<any> {
    return this.FarmModel.deleteOne(query)
  }
}
