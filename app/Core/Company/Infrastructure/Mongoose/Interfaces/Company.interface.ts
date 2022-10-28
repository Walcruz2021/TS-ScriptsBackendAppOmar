import { Document } from '@ioc:Mongoose'
import { Country } from 'App/Core/Country/Infraestructure/Mongoose/Interfaces'
import { Members } from 'App/Core/Crop/Infrastructure/Mongoose/Interfaces'
import { IUserProps } from '../../../../User/Infrastructure/Mongoose/Interfaces/User.interface'

export interface Company {
  _id: string | any
  identifier: string
  typePerson: string
  name: string
  address: string
  addressFloor?: string
  status?: boolean
  files?: Array<string>
  servicesIntegrations?: Array<ServiceIntegration>
  contacts?: Array<Contact>
  country: any
  unitMeasureSystem?: string
  types?: Array<string> | Array<CompanyType>
  users?: Array<CompanyUser>
  collaborators?: Array<CompanyCollaborator>
}

export interface Contact {
  type: string
  user: string
}

export interface ServiceIntegration {
  service: string
  integrate: boolean
}

export interface ICompanyProps {
  _id: string
  identifier: string
  name: string
  isAdmin?: boolean
  types?: CompanyType[]
  isResponsible?: boolean
  country?: Country | string
}

export type CompanyType = {
  _id: string
  name: string
}

export type CompanyUser = {
  _id?: string
  isAdmin: boolean
  isResponsible: boolean
  isDataEntry?: boolean
  user: IUserProps
  role: string
}

export interface CompanyCollaborator extends CompanyUser {
  company: ICompanyProps | string
  identifier: string
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface ICompanyInUserProps {
  company: string
  identifier?: string
  isAdmin: boolean
  isResponsible?: boolean
  role?: string
}

export enum CompanyTypeEnum {
  VERIFIERS = 'VERIFIERS',
  TRADERS = 'TRADERS',
  UCROPIT = 'UCROPIT',
  PRODUCERS = 'PRODUCER'
}

export interface IProducerCompaniesProps {
  _id: string
  identifier?: string
  isResponsible?: boolean
  crops: string[]
  members: Members[]
  country: Country
}

export type CompanyDocument = Company & Document
