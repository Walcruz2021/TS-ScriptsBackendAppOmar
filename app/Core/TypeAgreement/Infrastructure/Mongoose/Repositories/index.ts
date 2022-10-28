import TypeAgreement from 'App/Core/TypeAgreement/Infrastructure/Mongoose/Models/TypeAgreement'
import TypeAgreementRepo from 'App/Core/TypeAgreement/Infrastructure/Mongoose/Repositories/TypeAgreementRepository'

const TypeAgreementRepository = new TypeAgreementRepo(TypeAgreement)
export default TypeAgreementRepository
