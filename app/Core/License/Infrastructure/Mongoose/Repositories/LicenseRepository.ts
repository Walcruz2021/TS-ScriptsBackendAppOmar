import { LicenseRepositoryContract } from '../../Contracts'
import { LicenseDocument } from '../Interfaces'

export default class LicenseRepository implements LicenseRepositoryContract {
  constructor(private licenseModel) {}
  public async count<Object>(query: Object): Promise<any> {
    return this.licenseModel.find(query).count()
  }
  public async create<License>(data: License): Promise<LicenseDocument> {
    return this.licenseModel.create(data)
  }
  public async findAll<Object>(query: Object): Promise<LicenseDocument[]> {
    return this.licenseModel.find(query)
  }
  public async findOne<Object>(query: Object): Promise<LicenseDocument> {
    return this.licenseModel.findOne(query)
  }
  public async findOneSelect<Object>(query: Object): Promise<LicenseDocument> {
    return this.licenseModel.findOne(query).select('_id subLicenses').lean()
  }
  public async findOneLean<Object>(query: Object): Promise<LicenseDocument> {
    return this.licenseModel.findOne(query).lean()
  }
  public async findOneAndUpdate<Object>(
    query: Object,
    querySet: Object
  ): Promise<any> {
    return this.licenseModel.findOneAndUpdate(query, querySet)
  }

  public async updateOne<Object>(
    query: Object,
    querySet: Object
  ): Promise<any> {
    return this.licenseModel.updateOne(query, querySet)
  }

  public async findByCursor<Object>(
    query: Object
  ): Promise<Iterator<LicenseDocument>> {
    return this.licenseModel.find(query).cursor()
  }
  public async deleteOne<Object>(query: Object): Promise<any> {
    return this.licenseModel.deleteOne(query)
  }

  public async update<Object>(query: Object, querySet: Object): Promise<any> {
    return this.licenseModel.update(query, querySet)
  }
}
