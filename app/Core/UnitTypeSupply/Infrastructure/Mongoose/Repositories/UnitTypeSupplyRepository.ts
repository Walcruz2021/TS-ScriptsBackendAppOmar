import { UnitTypeSupplyRepositoryContract } from '../../Contracts'
import { UnitTypeSupplyDocument } from '../Interfaces'

export default class UnitTypeSupplyRepository
  implements UnitTypeSupplyRepositoryContract
{
  constructor(private unitTypeSupplyModel) {}
  public async count<Object>(query: Object): Promise<number> {
    return this.unitTypeSupplyModel.countDocuments(query)
  }
  public async create<Object>(data: Object): Promise<UnitTypeSupplyDocument> {
    return this.unitTypeSupplyModel.create(data)
  }
  public async findAll<Object>(
    query: Object
  ): Promise<UnitTypeSupplyDocument[]> {
    return this.unitTypeSupplyModel.find(query)
  }
  public async findOne<Object>(query: Object): Promise<UnitTypeSupplyDocument> {
    return this.unitTypeSupplyModel.findOne(query)
  }
  public async updateOne<Object>(
    query: Object,
    querySet: Object
  ): Promise<any> {
    return this.unitTypeSupplyModel.updateOne(query, querySet)
  }

  public async findOneAndUpdate<Object>(
    query: Object,
    querySet: Object
  ): Promise<any> {
    return this.unitTypeSupplyModel.findOneAndUpdate(query, querySet)
  }

  public async findByCursor<Object>(
    query: Object
  ): Promise<Iterator<UnitTypeSupplyDocument>> {
    return this.unitTypeSupplyModel.find(query).cursor()
  }
  public async deleteOne<Object>(query: Object): Promise<any> {
    return this.unitTypeSupplyModel.deleteOne(query)
  }
}
