import ApprovalRegisterSign from 'App/Core/ApprovalRegisterSign/Infrastructure/Mongoose/Models/ApprovalRegisterSign'
import ApprovalRegisterSignRepo from 'App/Core/ApprovalRegisterSign/Infrastructure/Mongoose/Repositories/ApprovalRegisterSignRepository'

const ApprovalRegisterSignRepository = new ApprovalRegisterSignRepo(
  ApprovalRegisterSign
)
export default ApprovalRegisterSignRepository
