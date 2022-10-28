import { CountryDocument } from 'App/Core/Country/Infraestructure/Mongoose/Interfaces'
import { CountryRepositoryContract } from 'App/Core/Country/Contracts'

export default class CountryRepository implements CountryRepositoryContract {
  constructor(private countryModel) {}
  public async findAll<Object>(query: Object): Promise<CountryDocument[]> {
    return this.countryModel.find(query)
  }
  public async findOneId<Object>(query: Object): Promise<CountryDocument> {
    return this.countryModel.findOne(query).select('_id').lean()
  }
  public async findOne<Object>(query: Object): Promise<CountryDocument> {
    return this.countryModel.findOne(query)
  }
  public async updateOne<Object>(query: Object, data): Promise<any> {
    return this.countryModel.updateOne(query, data)
  }
}
