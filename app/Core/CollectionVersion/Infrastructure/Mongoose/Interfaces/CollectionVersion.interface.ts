import { Document } from '@ioc:Mongoose'

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface ICollectionVersion {
  _id?: string
  collectionName: string
  versionDate: Date
}

export type CollectionVersionDocument = ICollectionVersion & Document
