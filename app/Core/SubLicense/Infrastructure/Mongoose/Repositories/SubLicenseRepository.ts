import { SubLicenseRepositoryContract } from '../../Contracts'
import { SubLicenseDocument } from '../Interfaces'

export default class SubLicenseRepository
  implements SubLicenseRepositoryContract
{
  constructor(private subLicenseModel) {}
  public async count<Object>(query: Object): Promise<any> {
    return this.subLicenseModel.find(query).count()
  }
  public async create<SubLicense>(
    data: SubLicense
  ): Promise<SubLicenseDocument> {
    return this.subLicenseModel.create(data)
  }
  public async findAll<Object>(query: Object): Promise<SubLicenseDocument[]> {
    return this.subLicenseModel.find(query)
  }
  public async findOne<Object>(query: Object): Promise<SubLicenseDocument> {
    return this.subLicenseModel.findOne(query)
  }

  public async findOneSort<Object>(query: Object): Promise<SubLicenseDocument> {
    return this.subLicenseModel.findOne(query).sort({
      idSublicense: -1
    })
  }
  public async findOneLean<Object>(query: Object): Promise<SubLicenseDocument> {
    return this.subLicenseModel.findOne(query).lean()
  }
  public async findOneAndUpdate<Object>(
    query: Object,
    querySet: Object
  ): Promise<any> {
    return this.subLicenseModel.findOneAndUpdate(query, querySet)
  }

  public async findByCursor<Object>(
    query: Object
  ): Promise<Iterator<SubLicenseDocument>> {
    return this.subLicenseModel.find(query).cursor()
  }
  public async deleteOne<Object>(query: Object): Promise<any> {
    return this.subLicenseModel.deleteOne(query)
  }

  public async update<Object>(query: Object, querySet: Object): Promise<any> {
    return this.subLicenseModel.update(query, querySet)
  }
}
