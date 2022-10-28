import VerificationType from '../Models/VerificationType'
import VerificationRepo from '../Repositories/VerificationRepository'

const VerificationTypeRepository = new VerificationRepo(VerificationType)
export default VerificationTypeRepository
