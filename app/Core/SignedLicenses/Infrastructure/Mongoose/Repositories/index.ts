import SignedLicense from 'App/Core/SignedLicenses/Infrastructure/Mongoose/Models/SignedLicense'
import SignedLicenseRepo from 'App/Core/SignedLicenses/Infrastructure/Mongoose/Repositories/SignedLicenseRepository'

const SignedLicenseRepository = new SignedLicenseRepo(SignedLicense)
export default SignedLicenseRepository
