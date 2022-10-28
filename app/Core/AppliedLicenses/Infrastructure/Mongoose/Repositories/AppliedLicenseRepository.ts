import { AppliedLicenseRepositoryContract } from '../../Contracts'
import { AppliedLicenseDocument } from '../Interfaces'

export default class AppliedLicenseRepository
  implements AppliedLicenseRepositoryContract
{
  constructor(private appliedlicenseModel) {}
  public async count<Object>(query: Object): Promise<any> {
    return this.appliedlicenseModel.find(query).count()
  }
  public async create<AppliedLicense>(
    data: AppliedLicense
  ): Promise<AppliedLicenseDocument> {
    return this.appliedlicenseModel.create(data)
  }
  public async findAll<Object>(
    query: Object
  ): Promise<AppliedLicenseDocument[]> {
    return this.appliedlicenseModel.find(query)
  }
  public async findOne<Object>(query: Object): Promise<AppliedLicenseDocument> {
    return this.appliedlicenseModel.findOne(query)
  }

  public async findOneLean<Object>(
    query: Object
  ): Promise<AppliedLicenseDocument> {
    return this.appliedlicenseModel.findOne(query).lean()
  }
  public async findOneAndUpdate<Object>(
    query: Object,
    querySet: Object
  ): Promise<any> {
    return this.appliedlicenseModel.findOneAndUpdate(query, querySet)
  }

  public async updateOne<Object>(
    query: Object,
    querySet: Object
  ): Promise<any> {
    return this.appliedlicenseModel.updateOne(query, querySet)
  }

  public async findByCursor<Object>(
    query: Object
  ): Promise<Iterator<AppliedLicenseDocument>> {
    return this.appliedlicenseModel.find(query).cursor()
  }
  public async deleteOne<Object>(query: Object): Promise<any> {
    return this.appliedlicenseModel.deleteOne(query)
  }

  public async update<Object>(query: Object, querySet: Object): Promise<any> {
    return this.appliedlicenseModel.update(query, querySet)
  }
}
