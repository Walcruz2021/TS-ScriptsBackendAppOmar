import { ActivityRepositoryContract } from '../../Contracts'
import { ActivityDocument } from '../Interfaces'

export default class ActivityRepository implements ActivityRepositoryContract {
  constructor(private activityModel) {}
  public async count<Object>(query: Object): Promise<any> {
    return this.activityModel.find(query).count()
  }
  public async create<Achievement>(
    data: Achievement
  ): Promise<ActivityDocument> {
    return this.activityModel.create(data)
  }
  public async findAll<Object>(query: Object): Promise<ActivityDocument[]> {
    return this.activityModel.find(query)
  }
  public async findOne<Object>(query: Object): Promise<ActivityDocument> {
    return this.activityModel.findOne(query)
  }
  public async findOnePopulate<Object>(
    query: Object
  ): Promise<ActivityDocument> {
    return this.activityModel
      .findOne(query)
      .populate('type')
      .populate('lots')
      .populate('typeAgreement')
      .populate('unitType')
      .populate('files')
      .populate('achievements')
      .populate({
        path: 'achievements',
        populate: [
          { path: 'lots' },
          { path: 'files' },
          { path: 'supplies', populate: [{ path: 'typeId' }] }
        ]
      })
  }
  public async findOneAndUpdate<Object>(
    query: Object,
    querySet: Object
  ): Promise<any> {
    return this.activityModel.findOneAndUpdate(query, querySet)
  }
  public async update<Object>(query: Object, querySet: Object): Promise<any> {
    return this.activityModel.updateOne(query, querySet)
  }

  public async findByCursor<Object>(
    query: Object,
    populate?: Array<any>
  ): Promise<Iterator<ActivityDocument>> {
    return this.activityModel
      .find(query)
      .populate(populate ?? [])
      .cursor()
  }

  public async findByCursorWithUser<Object>(
    query: Object
  ): Promise<Iterator<ActivityDocument>> {
    return this.activityModel
      .find(query)
      .populate({
        path: 'signers.userId',
        model: 'User'
      })
      .cursor()
  }

  public async findAllWithLots<Object>(
    query: Object
  ): Promise<ActivityDocument[]> {
    return this.activityModel.find(query).populate('lots')
  }

  public async deleteOne<Object>(query: Object): Promise<any> {
    return this.activityModel.deleteOne(query)
  }
  public async aggregate(
    pipelines: Record<string, any>[],
    isCursor?: boolean
  ): Promise<any> {
    if (isCursor) {
      return this.activityModel.aggregate(pipelines).cursor()
    }
    return this.activityModel.aggregate(pipelines)
  }
  public async replaceOne<T>(query: T, dataToUpdate: T): Promise<any> {
    return this.activityModel.replaceOne(query, dataToUpdate)
  }
}
