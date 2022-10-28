import { CompanyTypeDocument } from 'App/Core/CompanyType/Infrastructure/Mongoose/Interfaces/CompanyType.interface'
import { CompanyTypeRepositoryContract } from 'App/Core/CompanyType/Infrastructure/Contracts'

export default class CompanyTypeRepository
  implements CompanyTypeRepositoryContract
{
  constructor(private companyTypeModel) {}

  public async create<CompanyType>(
    data: CompanyType
  ): Promise<CompanyTypeDocument> {
    return this.companyTypeModel.create(data)
  }

  public async findAll<Object>(query: Object): Promise<CompanyTypeDocument[]> {
    return this.companyTypeModel.find(query)
  }
  public async findOne<Object>(query: Object): Promise<CompanyTypeDocument> {
    return this.companyTypeModel.findOne(query)
  }
}
