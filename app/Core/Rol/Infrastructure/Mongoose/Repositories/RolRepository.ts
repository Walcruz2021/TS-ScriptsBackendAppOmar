import { RolRepositoryContract } from '../../Contracts'
import { RolesDocument } from '../../Interfaces'
export default class RolRepository implements RolRepositoryContract {
  constructor(private RolModel) {}

  public async create<Object>(data: Object): Promise<RolesDocument> {
    return this.RolModel.create(data)
  }
  public async findOneAndUpdate<T>(query: T, querySet: T): Promise<any> {
    return this.RolModel.findOneAndUpdate(query, querySet)
  }

  public async findAll<T>(query: T): Promise<RolesDocument[]> {
    return this.RolModel.find(query)
  }
  public async findOne(query: any): Promise<RolesDocument> {
    return this.RolModel.findOne(query).lean()
  }

  public async updateOne<T>(query: T, data: T): Promise<any> {
    return this.RolModel.updateOne(query, data)
  }
  public async deleteOne<Object>(query: Object): Promise<any> {
    return this.RolModel.deleteOne(query)
  }
  public async replaceOne<T>(query: T, dataToUpdate: T): Promise<any> {
    return this.RolModel.replaceOne(query, dataToUpdate)
  }
}
