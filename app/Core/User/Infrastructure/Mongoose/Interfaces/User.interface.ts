import { Document } from '@ioc:Mongoose'
import { ICompanyInUserProps } from 'App/Core/Company/Infrastructure/Mongoose/Interfaces/Company.interface'

export interface User {
  email: string
  firstName?: string
  lastName?: string
  companies: ICompanyInUserProps[]
  collaboratorRequest: string[]
}

export interface IUserProps {
  _id?: string
  firstName: string
  lastName: string
  email: string
  companies: ICompanyInUserProps[]
  collaboratorRequest: string[]
}

export type UserDocument = User & Document
