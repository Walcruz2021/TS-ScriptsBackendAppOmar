import Achievement from '../Achievement/Infrastructure/Mongoose/Models/Achievement'
import Activity from '../Activity/Infrastructure/Mongoose/Models/Activity'
import ActivityType from '../ActivityType/Infrastructure/Mongoose/Models/ActivityType'
import ApprovalRegisterSign from '../ApprovalRegisterSign/Infrastructure/Mongoose/Models/ApprovalRegisterSign'
import Company from '../Company/Infrastructure/Mongoose/Models/Company'
import Country from '../Country/Infraestructure/Mongoose/Models/Country'
import CropType from '../CropType/Infraestructure/Mongoose/Models/CropType'
import Badges from '../Badges/Infrastructures/Mongoose/Models/Badges'
import CollaboratorRequest from '../CollaboratorRequests/Infrastructures/Mongoose/Models/CollaboratorRequest'
import Crop from '../Crop/Infrastructure/Mongoose/Models/Crop'

export * from './enums'

export const Collections = {
  activities: Activity,
  achievements: Achievement,
  approvalregistersigns: ApprovalRegisterSign,
  activitytypes: ActivityType,
  companies: Company,
  countries: Country,
  croptypes: CropType,
  badges: Badges,
  collaboratorrequests: CollaboratorRequest,
  crops: Crop
}
