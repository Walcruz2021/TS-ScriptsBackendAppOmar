import { model } from '@ioc:Mongoose'
import { ApprovalRegisterSignDocument } from '../Interfaces'
import { ApprovalRegisterSignSchema } from '../Schemas/ApprovalRegisterSign'

export default model<ApprovalRegisterSignDocument>(
  'ApprovalRegisterSign',
  ApprovalRegisterSignSchema
)
