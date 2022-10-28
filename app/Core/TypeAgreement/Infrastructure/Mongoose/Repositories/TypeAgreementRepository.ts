import { TypeAgreementRepositoryContract } from '../../Contracts'
import { TypeAgreementDocument } from '../Interfaces'

export default class TypeAgreementRepository
  implements TypeAgreementRepositoryContract
{
  constructor(private typeAgreementModel) {}
  public async count<Object>(query: Object): Promise<any> {
    return this.typeAgreementModel.find(query).count()
  }
  public async create<UnitType>(
    data: UnitType
  ): Promise<TypeAgreementDocument> {
    return this.typeAgreementModel.create(data)
  }
  public async findAll<Object>(
    query: Object
  ): Promise<TypeAgreementDocument[]> {
    return this.typeAgreementModel.find(query)
  }
  public async findOne<Object>(query: Object): Promise<TypeAgreementDocument> {
    return this.typeAgreementModel.findOne(query)
  }
  public async findOneAndUpdate<Object>(
    query: Object,
    querySet: Object
  ): Promise<any> {
    return this.typeAgreementModel.findOneAndUpdate(query, querySet)
  }

  public async findByCursor<Object>(
    query: Object
  ): Promise<Iterator<TypeAgreementDocument>> {
    return this.typeAgreementModel.find(query).cursor()
  }
  public async deleteOne<Object>(query: Object): Promise<any> {
    return this.typeAgreementModel.deleteOne(query)
  }
  public async update<Object>(query: Object, querySet: Object): Promise<any> {
    return this.typeAgreementModel.update(query, querySet)
  }
}
