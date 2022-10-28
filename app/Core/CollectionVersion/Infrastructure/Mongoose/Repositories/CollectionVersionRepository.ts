import { CollectionVersionRepositoryContract } from '../../Contracts'
// import { ICollectionVersion } from '../Interfaces'

export default class CollectionVersionRepository
  implements CollectionVersionRepositoryContract
{
  constructor(private CollectionVersionModel) {}

  public async createOrUpdate(querySet: Object | any): Promise<any> {
    const { collectionName, versionDate } = querySet
    const lastVersion = await this.CollectionVersionModel.findOne({
      collectionName
    }).lean()
    if (lastVersion) {
      return this.CollectionVersionModel.updateOne(
        { _id: lastVersion._id },
        { versionDate }
      )
    } else {
      return this.CollectionVersionModel.create(querySet)
    }
  }
  public async deleteMany(): Promise<any> {
    return this.CollectionVersionModel.deleteMany()
  }
}
