import { UserDocument } from '../Interfaces'
import { UserRepositoryContract } from 'App/Core/User/Contracts'

export default class UserRepository implements UserRepositoryContract {
  constructor(private userModel) {}
  public async create<User>(data: User): Promise<UserDocument> {
    return this.userModel.create(data)
  }

  public async findOne<Object>(
    query: Object,
    populate?: Array<any>
  ): Promise<UserDocument> {
    return this.userModel
      .findOne(query)
      .populate(populate ?? [])
      .lean()
  }

  public async findAll<Object>(
    query: Object,
    populate?: Array<any>
  ): Promise<UserDocument[]> {
    return this.userModel.find(query).populate(populate ?? [])
  }

  public async findAllSelect<Object>(query: Object): Promise<UserDocument[]> {
    return this.userModel.find(query).select('_id email companies').lean()
  }

  public async deleteOne<Object>(query: Object): Promise<any> {
    return this.userModel.deleteOne(query)
  }

  public async findOneAndUpdate<Object>(
    query: Object,
    querySet: Object
  ): Promise<any> {
    return this.userModel.findOneAndUpdate(query, querySet)
  }

  public async findWithAggregate(
    pipelines: any[],
    withCursor?: boolean
  ): Promise<any> {
    if (withCursor) {
      return this.userModel.aggregate(pipelines).allowDiskUse(true).cursor()
    }
    return this.userModel.aggregate(pipelines)
  }

  public async update<Object>(query: Object, querySet: Object): Promise<any> {
    return this.userModel.updateOne(query, querySet)
  }
  public async replaceOne<T>(query: T, dataToUpdate: T): Promise<any> {
    return this.userModel.replaceOne(query, dataToUpdate)
  }
}
