import { Document } from '@ioc:Mongoose'

export interface FileDocument {
  name?: string
  description?: string
  nameFile: string
  key: string
  path: string
  keyIntermediate?: string
  pathIntermediate?: string
  keyThumbnails?: string
  pathThumbnails?: string
  isPrivate?: boolean
  mimetype?: string
  codeMd5?: string
  size?: number
  pathServer?: string
  evidenceConcept?: string
}

export interface FileUrlDTO {
  filePath: string
  directory: string
  entityId: string
}

export interface CreateFileSyncDTO {
  url: string
  body?: any
  headers?: object
}

export interface IFileProps {
  _id?: string
  fileKey?: string
  url?: string
  key?: string
  path?: string
}

export interface CreateFileSyncDTO {
  url: string
  body?: any
  headers?: object
}

export type FileDocDocument = FileDocument & Document
