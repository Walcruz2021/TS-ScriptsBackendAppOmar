import { UserConfigDocument } from '../Interfaces'
import UserConfigRepositoryContract from 'App/Core/UserConfig/Contracts/UserConfigRepositoryContract'

export default class UserConfigRepository
  implements UserConfigRepositoryContract
{
  constructor(private userConfigModel) {}
  public async create<UserConfig>(
    data: UserConfig
  ): Promise<UserConfigDocument> {
    return this.userConfigModel.create(data)
  }
  public async findOne<Object>(
    query: Object,
    populate?: Array<any>
  ): Promise<UserConfigDocument> {
    return this.userConfigModel
      .findOne(query)
      .populate(populate ?? [])
      .lean()
  }
  public async findOneAndUpdate<Object>(
    query: Object,
    querySet: Object
  ): Promise<any> {
    return this.userConfigModel.findOneAndUpdate(query, querySet)
  }
  public async deleteOne<Object>(query: Object): Promise<any> {
    return this.userConfigModel.deleteOne(query)
  }
}
