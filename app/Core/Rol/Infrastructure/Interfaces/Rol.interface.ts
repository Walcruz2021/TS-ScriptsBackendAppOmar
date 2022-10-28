import { Document } from '@ioc:Mongoose'

export interface NameLanguageProps {
  es?: string
  en?: string
  pt?: string
}

export interface Roles {
  _id?: string
  value?: string
  label?: NameLanguageProps
  canMarkFlags: canMarkType[]
  assignable: Array<string>
  equivalentRole: string
  assignableCompany?: AssignableType
  assignableCrop?: Array<string>
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export type canMarkType = {
  _id?: string
  flag?: string
  targetRoles: string[] | any[]
}

type AssignableType = {
  withFlagAdmin: userAssignable[]
  withoutFlagAdmin: userAssignable[]
}

type userAssignable = {
  name: string
  isAdmin: boolean
  isResponsible: boolean
}

export type RolesDocument = Roles & Document
