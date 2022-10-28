import License from 'App/Core/License/Infrastructure/Mongoose/Models/License'
import LicenseRepo from 'App/Core/License/Infrastructure/Mongoose/Repositories/LicenseRepository'

const LicenseRepository = new LicenseRepo(License)
export default LicenseRepository
