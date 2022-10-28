import { EiqRangesRepositoryContract } from '../../Contracts'
import { EiqRangesDocument } from '../Interfaces'

export default class EiqRangesRepository
  implements EiqRangesRepositoryContract
{
  constructor(private eiqRangesModel) {}
  public async count<Object>(query: Object): Promise<any> {
    return this.eiqRangesModel.find(query).count()
  }
  public async create<EiqRanges>(data: EiqRanges): Promise<EiqRangesDocument> {
    return this.eiqRangesModel.create(data)
  }
  public async findAll<Object>(query: Object): Promise<EiqRangesDocument[]> {
    return this.eiqRangesModel.find(query)
  }
  public async findOne<Object>(query: Object): Promise<EiqRangesDocument> {
    return this.eiqRangesModel.findOne(query)
  }
  public async findOneAndUpdate<Object>(
    query: Object,
    querySet: Object
  ): Promise<any> {
    return this.eiqRangesModel.findOneAndUpdate(query, querySet)
  }

  public async findByCursor<Object>(
    query: Object
  ): Promise<Iterator<EiqRangesDocument>> {
    return this.eiqRangesModel.find(query).cursor()
  }
  public async deleteOne<Object>(query: Object): Promise<any> {
    return this.eiqRangesModel.deleteOne(query)
  }
}
