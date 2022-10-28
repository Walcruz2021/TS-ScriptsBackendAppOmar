import SubLicense from 'App/Core/SubLicense/Infrastructure/Mongoose/Models/SubLicense'
import SubLicenseRepo from 'App/Core/SubLicense/Infrastructure/Mongoose/Repositories/SubLicenseRepository'

const SubLicenseRepository = new SubLicenseRepo(SubLicense)
export default SubLicenseRepository
