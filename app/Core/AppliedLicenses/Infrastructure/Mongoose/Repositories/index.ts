import AppliedLicense from 'App/Core/AppliedLicenses/Infrastructure/Mongoose/Models/AppliedLicense'
import AppliedLicenseRepo from 'App/Core/AppliedLicenses/Infrastructure/Mongoose/Repositories/AppliedLicenseRepository'

const AppliedLicenseRepository = new AppliedLicenseRepo(AppliedLicense)
export default AppliedLicenseRepository
