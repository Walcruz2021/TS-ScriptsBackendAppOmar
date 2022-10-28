import { CropTypeDocument } from '../Interfaces'
import { CropTypeRepositoryContract } from '../../../Contracts'

export default class CropTypeRepo implements CropTypeRepositoryContract {
  constructor(private CropTypeModel) {}
  public async count<Object>(query: Object): Promise<any> {
    return this.CropTypeModel.find(query).count()
  }

  public async create<CropType>(data: CropType): Promise<CropTypeDocument> {
    return this.CropTypeModel.create(data)
  }

  public async findOne<Object>(query: Object): Promise<CropTypeDocument> {
    return this.CropTypeModel.findOne(query)
  }

  public async findOneSelect<Object>(query: Object): Promise<CropTypeDocument> {
    return this.CropTypeModel.findOne(query).select('_id identifier').lean()
  }

  public async updateOne<Object>(
    query: Object,
    data: Record<string, any>
  ): Promise<any> {
    return this.CropTypeModel.updateOne(query, data)
  }

  public async deleteOne<Object>(query: Object): Promise<any> {
    return this.CropTypeModel.deleteOne(query)
  }
  public async findAll<Object>(query: Object): Promise<CropTypeDocument[]> {
    return this.CropTypeModel.find(query)
  }
}
