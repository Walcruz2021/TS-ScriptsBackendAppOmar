import { LotRepositoryContract } from '../../Contracts'
export default class LotRepository implements LotRepositoryContract {
  constructor(private LotModel) {}

  public async updateOne(
    query: Record<string, any>,
    seData: Record<string, any>
  ): Promise<any> {
    return this.LotModel.updateOne(query, seData)
  }
  public async cursor(pipelines: Record<string, any>[]): Promise<any> {
    return this.LotModel.aggregate(pipelines).cursor()
  }
  public async count(pipelines: Record<string, any>[]): Promise<any> {
    return this.LotModel.aggregate(pipelines)
  }

  public async findAll<Object>(query: Object): Promise<any[]> {
    return this.LotModel.find(query)
  }

  public async findOne<Object>(query: Object): Promise<any> {
    return this.LotModel.findOne(query)
  }

  public async findOneAndUpdate<Object>(
    query: Object,
    querySet: Object
  ): Promise<any> {
    return this.LotModel.findOneAndUpdate(query, querySet)
  }

  public async replaceOne<T>(query: T, dataToUpdate: T): Promise<any> {
    return this.LotModel.replaceOne(query, dataToUpdate)
  }

  public async update<Object>(query: Object, querySet: Object): Promise<any> {
    return this.LotModel.update(query, querySet)
  }
}
