import Company from 'App/Core/Company/Infrastructure/Mongoose/Models/Company'
import CompanyRepo from 'App/Core/Company/Infrastructure/Mongoose/Repositories/CompanyRepository'

const CompanyRepository = new CompanyRepo(Company)
export default CompanyRepository
