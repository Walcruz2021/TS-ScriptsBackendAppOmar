import { ActiveIngredientRepositoryContract } from '../../Contracts'
import { ActiveIngredientDocument } from '../Interfaces'

export default class ActiveIngredientRepository
  implements ActiveIngredientRepositoryContract
{
  constructor(private activeIngredientModel) {}
  public async count<Object>(query: Object): Promise<any> {
    return this.activeIngredientModel.find(query).count()
  }
  public async create<Supply>(data: Supply): Promise<ActiveIngredientDocument> {
    return this.activeIngredientModel.create(data)
  }
  public async findAll<Object>(
    query: Object
  ): Promise<ActiveIngredientDocument[]> {
    return this.activeIngredientModel.find(query)
  }
  public async findOne<Object>(
    query: Object
  ): Promise<ActiveIngredientDocument> {
    return this.activeIngredientModel.findOne(query)
  }
  public async findOneAndUpdate<Object>(
    query: Object,
    querySet: Object
  ): Promise<any> {
    return this.activeIngredientModel.findOneAndUpdate(query, querySet)
  }

  public async findByCursor<Object>(
    query: Object
  ): Promise<Iterator<ActiveIngredientDocument>> {
    return this.activeIngredientModel.find(query).cursor()
  }
  public async deleteOne<Object>(query: Object): Promise<any> {
    return this.activeIngredientModel.deleteOne(query)
  }

  public async update<Object>(query: Object, querySet: Object): Promise<any> {
    return this.activeIngredientModel.update(query, querySet)
  }
}
