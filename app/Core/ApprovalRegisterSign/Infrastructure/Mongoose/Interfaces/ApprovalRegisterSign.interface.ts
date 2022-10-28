import { Document } from '@ioc:Mongoose'

export interface ApprovalRegisterSign {
  _id?: string
  ots: string
  hash: string
  pathPdf: string
  nameFilePdf: string
  nameFileOts: string
  pathOtsFile: string
  activity: string | any
  file?: string | any
  createdAt?: string
  updatedAt?: string
}
export interface FileDocumentApproval {
  _id?: string
  nameFile: string
  path: string
  user?: string | any
  date: Date
  activityId?: string
}

export const collectionName = 'ApprovalRegisterSign'

export type ApprovalRegisterSignDocument = ApprovalRegisterSign & Document
