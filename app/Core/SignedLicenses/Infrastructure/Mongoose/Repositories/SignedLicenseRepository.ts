import { SignedLicenseRepositoryContract } from '../../Contracts'
import { SignedLicenseDocument } from '../Interfaces'

export default class SignedLicenseRepository
  implements SignedLicenseRepositoryContract
{
  constructor(private signedlicenseModel) {}
  public async count<Object>(query: Object): Promise<any> {
    return this.signedlicenseModel.find(query).count()
  }
  public async create<SignedLicense>(
    data: SignedLicense
  ): Promise<SignedLicenseDocument> {
    return this.signedlicenseModel.create(data)
  }
  public async findAll<Object>(
    query: Object
  ): Promise<SignedLicenseDocument[]> {
    return this.signedlicenseModel.find(query)
  }
  public async findOne<Object>(query: Object): Promise<SignedLicenseDocument> {
    return this.signedlicenseModel.findOne(query)
  }

  public async findOneLean<Object>(
    query: Object
  ): Promise<SignedLicenseDocument> {
    return this.signedlicenseModel.findOne(query).lean()
  }
  public async findOneAndUpdate<Object>(
    query: Object,
    querySet: Object
  ): Promise<any> {
    return this.signedlicenseModel.findOneAndUpdate(query, querySet)
  }

  public async updateOne<Object>(
    query: Object,
    querySet: Object
  ): Promise<any> {
    return this.signedlicenseModel.updateOne(query, querySet)
  }

  public async findByCursor<Object>(
    query: Object
  ): Promise<Iterator<SignedLicenseDocument>> {
    return this.signedlicenseModel.find(query).cursor()
  }
  public async deleteOne<Object>(query: Object): Promise<any> {
    return this.signedlicenseModel.deleteOne(query)
  }

  public async update<Object>(query: Object, querySet: Object): Promise<any> {
    return this.signedlicenseModel.update(query, querySet)
  }
}
