import EiqRanges from 'App/Core/EiqRanges/Infrastructure/Mongoose/Models/EiqRanges'
import EiqRangesRepo from 'App/Core/EiqRanges/Infrastructure/Mongoose/Repositories/EiqRangesRepository'

const EiqRangesRepository = new EiqRangesRepo(EiqRanges)
export default EiqRangesRepository
