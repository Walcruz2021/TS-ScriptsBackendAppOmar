import { Document } from '@ioc:Mongoose'

export interface CropMigratedMember {
  crop: string
  roleType: string
  user: string
}

export type CropMigratedMemberDocument = CropMigratedMember & Document
