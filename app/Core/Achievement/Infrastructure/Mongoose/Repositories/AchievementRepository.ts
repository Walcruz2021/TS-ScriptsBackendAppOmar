import { AchievementRepositoryContract } from '../../Contracts'
import { AchievementDocument } from '../Interfaces'

export default class AchievementRepository
  implements AchievementRepositoryContract
{
  constructor(private achievementModel) {}
  public async count<Object>(query: Object): Promise<any> {
    return this.achievementModel.find(query).count()
  }
  public async create<Achievement>(
    data: Achievement
  ): Promise<AchievementDocument> {
    return this.achievementModel.create(data)
  }
  public async findAll<Object>(query: Object): Promise<AchievementDocument[]> {
    return this.achievementModel.find(query)
  }
  public async findOne<Object>(query: Object): Promise<AchievementDocument> {
    return this.achievementModel.findOne(query)
  }
  public async findOneAndUpdate<Object>(
    query: Object,
    querySet: Object
  ): Promise<any> {
    return this.achievementModel.findOneAndUpdate(query, querySet)
  }

  public async findByCursor<Object>(
    query: Object,
    populate?: Array<any>
  ): Promise<Iterator<AchievementDocument>> {
    return this.achievementModel
      .find(query)
      .populate(populate ?? [])
      .cursor()
  }

  public async findByCursorWithUser<Object>(
    query: Object
  ): Promise<Iterator<AchievementDocument>> {
    return this.achievementModel
      .find(query)
      .populate({
        path: 'signers.userId',
        model: 'User'
      })
      .cursor()
  }
  public async updateMany<Object>(
    query: Object,
    querySet: Object
  ): Promise<any> {
    return this.achievementModel.updateMany(query, querySet)
  }
  public async replaceOne<T>(query: T, dataToUpdate: T): Promise<any> {
    return this.achievementModel.replaceOne(query, dataToUpdate)
  }
  public async update<Object>(query: Object, querySet: Object): Promise<any> {
    return this.achievementModel.update(query, querySet)
  }
  public async findOnePopulate<Object>(
    query: Object
  ): Promise<AchievementDocument> {
    return this.achievementModel
      .findOne(query)
      .populate('activity')
      .populate({
        path: 'supplies',
        populate: [{ path: 'supply' }]
      })
  }
}
