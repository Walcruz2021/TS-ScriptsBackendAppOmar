import { model } from '@ioc:Mongoose'
import { CropMigratedMemberSchema } from '../Schemas/CropMigratedMember'
import { CropMigratedMemberDocument } from 'App/Core/CropMigratedMember/Infraestructure/Mongoose/Interfaces/CropMigratedMember.interface'
export default model<CropMigratedMemberDocument>(
  'CropMigratedMember',
  CropMigratedMemberSchema
)
