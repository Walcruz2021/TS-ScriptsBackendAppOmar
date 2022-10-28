import { NormativeConfigRepositoryContract } from '../../Contracts'
import { NormativeConfigDocument } from '../Interfaces'

export default class NormativeConfigRepository
  implements NormativeConfigRepositoryContract
{
  constructor(private normativeConfigModel) {}
  public async count<Object>(query: Object): Promise<any> {
    return this.normativeConfigModel.find(query).count()
  }
  public async create<NormativeConfig>(
    data: NormativeConfig
  ): Promise<NormativeConfigDocument> {
    return this.normativeConfigModel.create(data)
  }
  public async findAll<Object>(
    query: Object
  ): Promise<NormativeConfigDocument[]> {
    return this.normativeConfigModel.find(query)
  }
  public async findOne<Object>(
    query: Object
  ): Promise<NormativeConfigDocument> {
    return this.normativeConfigModel.findOne(query)
  }
  public async findOneAndUpdate<Object>(
    query: Object,
    querySet: Object
  ): Promise<any> {
    return this.normativeConfigModel.findOneAndUpdate(query, querySet)
  }

  public async findByCursor<Object>(
    query: Object
  ): Promise<Iterator<NormativeConfigDocument>> {
    return this.normativeConfigModel.find(query).cursor()
  }
  public async deleteOne<Object>(query: Object): Promise<any> {
    return this.normativeConfigModel.deleteOne(query)
  }
  public async getByAlphaCodeAndCropType(
    alphaCode: string,
    cropsType: string,
    dateRef: string
  ) {
    return this.normativeConfigModel
      .find({
        alphaCode,
        cropsType,
        dateReference: {
          $lte: dateRef
        }
      })
      .lean()
  }
}
