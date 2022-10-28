import { Document } from '@ioc:Mongoose'

export type AllowedRoleType = {
  _id?: string
  role?: string
}
export interface Flag {
  _id?: string
  codeLabel: string
  key: string
  allowedRoles?: AllowedRoleType[]
}

export type FlagDocument = Flag & Document
