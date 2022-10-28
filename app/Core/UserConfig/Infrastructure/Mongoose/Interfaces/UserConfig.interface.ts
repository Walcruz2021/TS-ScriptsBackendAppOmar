import { Document } from '@ioc:Mongoose'

export interface UserConfig {
  fromInvitation?: boolean
  hasPin?: boolean
  companySelected: string
  languageSelected?: string
  roleSelected?: string
  isAdmin?: boolean
  isResponsible?: boolean
}

export type UserConfigDocument = UserConfig & Document
