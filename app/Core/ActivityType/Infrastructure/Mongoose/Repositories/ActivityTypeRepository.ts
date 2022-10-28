import { ActivityTypeRepositoryContract } from '../../Contracts'
import { ActivityTypeDocument } from '../Interfaces'
import { dataSetType } from 'App/Core/commons/dataSet.type'

export default class ActivityTypeRepository
  implements ActivityTypeRepositoryContract
{
  constructor(private activityModel) {}
  public async count<Object>(query: Object): Promise<any> {
    return this.activityModel.find(query).count()
  }
  public async create<ActivityType>(
    data: ActivityType
  ): Promise<ActivityTypeDocument> {
    return this.activityModel.create(data)
  }
  public async findAll<Object>(query: Object): Promise<ActivityTypeDocument[]> {
    return this.activityModel.find(query)
  }
  public async findOne<Object>(query: Object): Promise<ActivityTypeDocument> {
    return this.activityModel.findOne(query)
  }
  public async findOneAndUpdate<Object>(
    query: Object,
    querySet: Object
  ): Promise<any> {
    return this.activityModel.findOneAndUpdate(query, querySet)
  }

  public async updateOne<ActivityType>(
    query: Partial<ActivityType>,
    querySet: dataSetType
  ): Promise<any> {
    return this.activityModel.updateOne(query, querySet)
  }

  public async findByCursor<Object>(
    query: Object
  ): Promise<Iterator<ActivityTypeDocument>> {
    return this.activityModel.find(query).cursor()
  }
  public async deleteOne<Object>(query: Object): Promise<any> {
    return this.activityModel.deleteOne(query)
  }
}
