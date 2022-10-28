import { CompanyDocument } from '../Interfaces'
import CompanyRepositoryContract from '../../Contracts/CompanyRepositoryContract'

export default class CompanyRepository implements CompanyRepositoryContract {
  constructor(private companyModel) {}
  public async count<Object>(query: Object): Promise<any> {
    return this.companyModel.find(query).count()
  }
  public async create<Company>(data: Company): Promise<CompanyDocument> {
    return this.companyModel.create(data)
  }

  public async findByCursor<Object>(
    query: Object,
    populate?: Array<any>
  ): Promise<Iterator<CompanyDocument>> {
    return this.companyModel
      .find(query)
      .populate(populate ?? [])
      .cursor()
  }

  public async findWithAggregate(pipelines: any[]) {
    return this.companyModel.aggregate(pipelines)
  }

  public async findOne<Object>(
    query: Object,
    populate?
  ): Promise<CompanyDocument> {
    return this.companyModel.findOne(query).populate(populate ?? [])
  }
  public async findOneTypes<Object>(query: Object): Promise<CompanyDocument> {
    return this.companyModel.findOne(query).populate('types').lean()
  }
  public async findAllWithCountry<Object>(
    query: Object
  ): Promise<CompanyDocument[]> {
    return this.companyModel.find(query).populate('country').lean()
  }
  public async findOneLean<Object>(query: Object): Promise<CompanyDocument> {
    return this.companyModel.findOne(query).lean()
  }

  public async findOneSelect<Object>(query: Object): Promise<CompanyDocument> {
    return this.companyModel.findOne(query).select('_id identifier').lean()
  }

  public async updateOne<Object>(
    query: Object,
    data: Record<string, any>
  ): Promise<any> {
    return this.companyModel.updateOne(query, data)
  }

  public async findOneAndUpdate<Object>(
    query: Object,
    querySet: Object
  ): Promise<any> {
    return this.companyModel.findOneAndUpdate(query, querySet)
  }

  public async updateMany<Object>(
    query: Object,
    querySet: Object
  ): Promise<any> {
    return this.companyModel.updateMany(query, querySet)
  }

  public async deleteOne<Object>(query: Object): Promise<any> {
    return this.companyModel.deleteOne(query)
  }
  public async findAll<Object>(query: Object): Promise<CompanyDocument[]> {
    return this.companyModel.find(query)
  }
  public async replaceOne<T>(query: T, dataToUpdate: T): Promise<any> {
    return this.companyModel.replaceOne(query, dataToUpdate)
  }

  public async update<Object>(query: Object, querySet: Object): Promise<any> {
    return this.companyModel.updateOne(query, querySet)
  }
}
