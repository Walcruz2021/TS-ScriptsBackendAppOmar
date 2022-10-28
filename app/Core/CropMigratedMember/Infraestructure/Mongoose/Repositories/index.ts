import CropMigratedMember from '../Models/CropMigratedMember'
import CropMigratedMemberRepo from './CropMigratedMemberRepository'

const CropMigratedMemberRepository = new CropMigratedMemberRepo(
  CropMigratedMember
)
export default CropMigratedMemberRepository
