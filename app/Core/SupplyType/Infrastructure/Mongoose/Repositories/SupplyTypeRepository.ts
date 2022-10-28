import { SupplyTypeRepositoryContract } from '../../Contracts'
import { SupplyTypeDocument } from '../Interfaces'

export default class SupplyTypeRepository
  implements SupplyTypeRepositoryContract
{
  constructor(private supplyTypeModel) {}
  public async count<Object>(query: Object): Promise<number> {
    return this.supplyTypeModel.find(query).count()
  }
  public async create<Supply>(data: Supply): Promise<SupplyTypeDocument> {
    return this.supplyTypeModel.create(data)
  }
  public async findAll<Object>(query: Object): Promise<SupplyTypeDocument[]> {
    return this.supplyTypeModel.find(query)
  }
  public async findOne<Object>(query: Object): Promise<SupplyTypeDocument> {
    return this.supplyTypeModel.findOne(query)
  }
  public async findOneAndUpdate<Object>(
    query: Object,
    querySet: Object
  ): Promise<any> {
    return this.supplyTypeModel.findOneAndUpdate(query, querySet)
  }

  public async findByCursor<Object>(
    query: Object
  ): Promise<Iterator<SupplyTypeDocument>> {
    return this.supplyTypeModel.find(query).cursor()
  }

  public async deleteOne<Object>(query: Object): Promise<any> {
    return this.supplyTypeModel.deleteOne(query)
  }
}
