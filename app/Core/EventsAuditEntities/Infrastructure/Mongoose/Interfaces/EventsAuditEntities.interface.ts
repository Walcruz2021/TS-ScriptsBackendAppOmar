import { Document } from '@ioc:Mongoose'

export interface EventsAuditEntities {
  _id?: any
  readonly documentKey: String
  readonly fullDocument?: Object
  readonly user: String
  entity: IEntity
  operationType: EOperationTypeDataBase
  createdAt?: string
  updatedAt?: string
}

export enum IEntity {
  CROP = 'CROP',
  LOT = 'LOT',
  ACTIVITY = 'ACTIVITY',
  COMPANY = 'COMPANY',
  ACHIEVEMENT = 'ACHIEVEMENT',
  FILE = 'FILE',
  SUPPLY = 'SUPPLY',
  EVIDENCECONCEPT = 'EVIDENCECONCEPT',
  APPROVALREGISTERSIGNS = 'APPROVALREGISTERSIGNS',
  TYPEAGREEMENT = 'TYPEAGREEMENT',
  LICENSE = 'LICENSE',
  CROPTYPE = 'CROPTYPE',
  SUPPLYTYPE = 'SUPPLYTYPE',
  SUBLICENSE = 'SUBLICENSE',
  VERIFICATIONTYPE = 'VERIFICATIONTYPE',
  SUBTYPEACTIVITY = 'SUBTYPEACTIVITY',
  ACTIVEINGREDIENT = 'ACTIVEINGREDIENT',
  FILEDOCUMENT = 'FILEDOCUMENT',
  USER = 'USER',
  USERCONFIG = 'USERCONFIG',
  FARM = 'FARM'
}

export enum EOperationTypeDataBase {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE'
}

export const collectionName = 'EventsAuditEntities'

export type EventsAuditEntitiesDocument = EventsAuditEntities & Document
