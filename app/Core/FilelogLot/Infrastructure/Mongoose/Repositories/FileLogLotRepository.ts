import { FileLogLotRepositoryContract } from '../../Contracts'
import { IFileLogLotInterface } from 'App/Core/FilelogLot/Infrastructure/Interfaces/FileLogLot.interface'
export default class FileLogLotRepository
  implements FileLogLotRepositoryContract
{
  constructor(private FileLogLotModel) {}

  public async updateOne(
    query: Record<string, any>,
    seData: Record<string, any>
  ): Promise<any> {
    return this.FileLogLotModel.updateOne(query, seData)
  }
  public async cursor(pipelines: Record<string, any>[]): Promise<any> {
    return this.FileLogLotModel.aggregate(pipelines).cursor()
  }
  public async count(pipelines: Record<string, any>[]): Promise<any> {
    return this.FileLogLotModel.aggregate(pipelines)
  }

  public async findAll<Object>(query: Object): Promise<any[]> {
    return this.FileLogLotModel.find(query)
  }

  public async findOne<Object>(query: Object): Promise<any> {
    return this.FileLogLotModel.findOne(query)
  }
  public async findOneAndUpdate<Object>(
    query: Object,
    querySet: Object
  ): Promise<any> {
    return this.FileLogLotModel.findOneAndUpdate(query, querySet)
  }
  public async save(data: IFileLogLotInterface): Promise<any> {
    return this.FileLogLotModel.create(data)
  }
}
