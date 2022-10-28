import { SupplyRepositoryContract } from '../../Contracts'
import { SupplyDocument } from '../Interfaces'

export default class SupplyRepository implements SupplyRepositoryContract {
  constructor(private supplyModel) {}
  public async count<Object>(query: Object): Promise<any> {
    return this.supplyModel.find(query).count()
  }
  public async create<Supply>(data: Supply): Promise<SupplyDocument> {
    return this.supplyModel.create(data)
  }
  public async findAll<Object>(query: Object): Promise<SupplyDocument[]> {
    return this.supplyModel.find(query)
  }
  public async findOne<Object>(query: Object): Promise<SupplyDocument> {
    return this.supplyModel.findOne(query)
  }
  public async updateOne<Object>(
    query: Object,
    querySet: Object
  ): Promise<any> {
    return this.supplyModel.updateOne(query, querySet)
  }
  public async findOneAndUpdate<Object>(
    query: Object,
    querySet: Object
  ): Promise<any> {
    return this.supplyModel.findOneAndUpdate(query, querySet)
  }

  public async findByCursor<Object>(
    query: Object
  ): Promise<Iterator<SupplyDocument>> {
    return this.supplyModel.find(query).cursor()
  }
  public async deleteOne<Object>(query: Object): Promise<any> {
    return this.supplyModel.deleteOne(query)
  }

  public async update<Object>(query: Object, querySet: Object): Promise<any> {
    return this.supplyModel.update(query, querySet)
  }
}
