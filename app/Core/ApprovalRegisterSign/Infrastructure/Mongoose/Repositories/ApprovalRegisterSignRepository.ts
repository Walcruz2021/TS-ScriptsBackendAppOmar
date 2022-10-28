import { ApprovalRegisterSignContract } from '../../Contracts'
import { ApprovalRegisterSignDocument } from '../Interfaces'

export default class ApprovalRegisterSignRepository
  implements ApprovalRegisterSignContract
{
  constructor(private approvalRegisterSignModel) {}
  public async count<Object>(query: Object): Promise<any> {
    return this.approvalRegisterSignModel.find(query).count()
  }
  public async create<ApprovalRegisterSign>(
    data: ApprovalRegisterSign
  ): Promise<ApprovalRegisterSignDocument> {
    return this.approvalRegisterSignModel.create(data)
  }
  public async findAll<Object>(
    query: Object
  ): Promise<ApprovalRegisterSignDocument[]> {
    return this.approvalRegisterSignModel.find(query)
  }
  public async findOne<Object>(
    query: Object
  ): Promise<ApprovalRegisterSignDocument> {
    return this.approvalRegisterSignModel.findOne(query)
  }
  public async findOneAndUpdate<Object>(
    query: Object,
    querySet: Object
  ): Promise<any> {
    return this.approvalRegisterSignModel.findOneAndUpdate(query, querySet)
  }

  public async findByCursor<Object>(
    query: Object
  ): Promise<Iterator<ApprovalRegisterSignDocument>> {
    return this.approvalRegisterSignModel.find(query).cursor()
  }
  public async deleteOne<Object>(query: Object): Promise<any> {
    return this.approvalRegisterSignModel.deleteOne(query)
  }
}
