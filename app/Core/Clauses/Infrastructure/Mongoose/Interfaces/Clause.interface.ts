import { Document } from '@ioc:Mongoose'
import { IFileProps } from 'App/Core/FileDocument/Infrastructure/Mongoose/Interfaces/FileDocument.interface'

export interface Clause {
  _id?: string
  title: String
  slug: String
  description: String
  imageOriginal: FileObj
  imageIntermediate: FileObj
  imageThumbnail: FileObj
  id_clause: Number
}

export interface IClauseProps {
  title: string
  slug?: string
  description: string
  image?: string
  imageOriginal?: IFileProps
  imageIntermediate?: IFileProps
  imageThumbnail?: IFileProps
  id_clause?: number
}

export interface FileObj {
  url: {
    type: String
  }
  fileKey: {
    type: String
  }
}
export const collectionName = 'clause'

export type ClauseDocument = Clause & Document
