import { CropRepositoryContract } from '../../Contracts'
import { CropDocument } from '../Interfaces'
export default class CropRepository implements CropRepositoryContract {
  constructor(private CropModel) {}
  public async findOneAndUpdate<T>(query: T, querySet: T): Promise<any> {
    return this.CropModel.findOneAndUpdate(query, querySet)
  }
  public async findAll<T>(query: T, populate?: Array<any>): Promise<any[]> {
    const injectPopulate = populate ?? [{ path: 'members.user' }]
    return this.CropModel.find(query).populate(injectPopulate)
  }

  public async findOne(query: any): Promise<any> {
    return this.CropModel.findOne(query).populate('members.user')
  }
  public async findOneWithCropType(query: any): Promise<any> {
    return this.CropModel.findOne(query).populate('cropType')
  }
  public async findOneWithLots(query: any): Promise<any> {
    return this.CropModel.findOne(query)
      .populate('members.user')
      .populate('lots.data')
  }
  public async findCropsCursor(
    pipelines: any[],
    options?: Record<string, unknown>
  ) {
    const cursor = await this.CropModel.aggregate(pipelines)
      .allowDiskUse(true)
      .cursor(options ?? {})
    return cursor
  }
  public async findWithAggregate(pipelines: any[]) {
    return this.CropModel.aggregate(pipelines)
  }

  public async findByCursor<Object>(
    query: Object,
    populate?: Array<any>
  ): Promise<Iterator<CropDocument>> {
    return this.CropModel.find(query)
      .populate(populate ?? [])
      .cursor()
  }

  public async findWithAggregation(pipelines: any[]) {
    return this.CropModel.aggregate(pipelines)
  }

  public async count<Object>(
    query: Object,
    populate?: Array<any>
  ): Promise<any> {
    return this.CropModel.find(query)
      .populate(populate ?? [])
      .count()
  }

  public async findOneAndUpdateTimestamp<T>(
    query: T,
    querySet: T
  ): Promise<any> {
    return this.CropModel.findOneAndUpdate(query, querySet, {
      timestamps: false
    })
  }

  public async findCropsWithLotsPopulateData(query): Promise<any> {
    const populate = [
      'lots.data',
      {
        path: 'finished',
        select: 'dateHarvest type lots',
        populate: [{ path: 'type', select: 'tag' }]
      }
    ]
    return this.CropModel.find(query).populate(populate)
  }

  public async findOneWithActivityAchievementPopulate(
    query: any
  ): Promise<any> {
    return this.CropModel.findOne(query).populate('done').populate({
      path: 'done',
      populate: 'achievements'
    })
  }

  public async replaceOne<T>(query: T, dataToUpdate: T): Promise<any> {
    return this.CropModel.replaceOne(query, dataToUpdate)
  }
  public async updateMany<T>(query: T, dataToUpdate: T): Promise<any> {
    return this.CropModel.updateMany(query, dataToUpdate)
  }

  public async update<Object>(query: Object, querySet: Object): Promise<any> {
    return this.CropModel.update(query, querySet)
  }
  public async updateOne<T>(query: T, querySet: T): Promise<any> {
    return this.CropModel.updateOne(query, querySet)
  }
}
