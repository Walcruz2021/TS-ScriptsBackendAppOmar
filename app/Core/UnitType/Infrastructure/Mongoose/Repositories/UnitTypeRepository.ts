import { UnitTypeRepositoryContract } from '../../Contracts'
import { UnitTypeDocument } from '../Interfaces'

export default class UnitTypeRepository implements UnitTypeRepositoryContract {
  constructor(private unitTypeModel) {}
  public async count<Object>(query: Object): Promise<any> {
    return this.unitTypeModel.find(query).count()
  }
  public async create<UnitType>(data: UnitType): Promise<UnitTypeDocument> {
    return this.unitTypeModel.create(data)
  }
  public async findAll<Object>(query: Object): Promise<UnitTypeDocument[]> {
    return this.unitTypeModel.find(query)
  }
  public async findOne<Object>(query: Object): Promise<UnitTypeDocument> {
    return this.unitTypeModel.findOne(query)
  }
  public async findOneAndUpdate<Object>(
    query: Object,
    querySet: Object
  ): Promise<any> {
    return this.unitTypeModel.findOneAndUpdate(query, querySet)
  }

  public async findByCursor<Object>(
    query: Object
  ): Promise<Iterator<UnitTypeDocument>> {
    return this.unitTypeModel.find(query).cursor()
  }
  public async deleteOne<Object>(query: Object): Promise<any> {
    return this.unitTypeModel.deleteOne(query)
  }
}
