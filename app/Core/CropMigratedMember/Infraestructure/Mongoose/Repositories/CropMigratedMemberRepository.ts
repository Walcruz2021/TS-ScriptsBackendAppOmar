import { CropMigratedMemberDocument } from 'App/Core/CropMigratedMember/Infraestructure/Mongoose/Interfaces/CropMigratedMember.interface'
import CropMigratedMemberContract from 'App/Core/CropMigratedMember/Contracts/CropMigratedMemberRepositoryContract'

export default class CropMigratedMemberRepo
  implements CropMigratedMemberContract
{
  constructor(private CropMigratedMemberModel) {}

  public async create<CropType>(
    data: CropType
  ): Promise<CropMigratedMemberDocument> {
    return this.CropMigratedMemberModel.create(data)
  }

  public async findOne<Object>(
    query: Object
  ): Promise<CropMigratedMemberDocument> {
    return this.CropMigratedMemberModel.findOne(query)
  }

  public async updateOne<Object>(
    query: Object,
    data: Record<string, any>
  ): Promise<any> {
    return this.CropMigratedMemberModel.updateOne(query, data)
  }
}
