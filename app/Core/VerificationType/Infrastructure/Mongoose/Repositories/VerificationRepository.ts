import { VerificationTypeDocument } from '../Interfaces'
import { VerificationTypeRepositoryContract } from '../../../Contracts'

export default class VerificationRepo
  implements VerificationTypeRepositoryContract
{
  constructor(private verificationModel) {}
  public async create<VerificationType>(
    data: VerificationType
  ): Promise<VerificationTypeDocument> {
    return this.verificationModel.create(data)
  }
  public async deleteOne<Object>(query: Object): Promise<any> {
    return this.verificationModel.deleteOne(query)
  }

  public async findOne<Object>(
    query: Object
  ): Promise<VerificationTypeDocument> {
    return this.verificationModel.findOne(query)
  }
}
