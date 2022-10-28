import { LandscapeSustainabilityRepositoryContract } from '../../Contracts'
import { LandscapeSustainabilityDocument } from '../Interfaces'

export default class LandscapeSustainabilityRepository
  implements LandscapeSustainabilityRepositoryContract
{
  constructor(private landscapeSustainabilityModel) {}
  public async count<Object>(query: Object): Promise<any> {
    return this.landscapeSustainabilityModel.find(query).count()
  }
  public async create<LandscapeSustainability>(
    data: LandscapeSustainability
  ): Promise<LandscapeSustainabilityDocument> {
    return this.landscapeSustainabilityModel.create(data)
  }
  public async findAll<Object>(
    query: Object
  ): Promise<LandscapeSustainabilityDocument[]> {
    return this.landscapeSustainabilityModel.find(query)
  }
  public async findOne<Object>(
    query: Object
  ): Promise<LandscapeSustainabilityDocument> {
    return this.landscapeSustainabilityModel.findOne(query)
  }
  public async findOneAndUpdate<Object>(
    query: Object,
    querySet: Object
  ): Promise<any> {
    return this.landscapeSustainabilityModel.findOneAndUpdate(query, querySet)
  }

  public async findByCursor<Object>(
    query: Object
  ): Promise<Iterator<LandscapeSustainabilityDocument>> {
    return this.landscapeSustainabilityModel.find(query).cursor()
  }
  public async deleteOne<Object>(query: Object): Promise<any> {
    return this.landscapeSustainabilityModel.deleteOne(query)
  }
  public async updateMany<Object>(
    query: Object,
    querySet: Object
  ): Promise<any> {
    return this.landscapeSustainabilityModel.updateMany(query, querySet)
  }
}
