import CompanyType from 'App/Core/CompanyType/Infrastructure/Mongoose/Models/CompanyType'
import CompanyTypeRepo from 'App/Core/CompanyType/Infrastructure/Mongoose/Repositories/CompanyTypeRepository'

const CompanyTypeRepository = new CompanyTypeRepo(CompanyType)
export default CompanyTypeRepository
