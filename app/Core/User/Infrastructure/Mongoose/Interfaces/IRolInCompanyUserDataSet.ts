import { ERoles, Roles } from 'App/Core/Rol/Infrastructure/Interfaces'
import { CompanyType } from 'App/Core/CompanyType/Infrastructure/Mongoose/Interfaces'
import { CompanyTypeEnum } from 'App/Core/CompanyType/Infrastructure/enums/CompanyType.enum'

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface IRolInCompanyUserDataSet {
  rolValue: ERoles | null
  equivalentRoleValue: ERoles | null
  companyTypeValue: CompanyTypeEnum | null
  rolCompany?: Roles
  rolCrop?: Roles
  companyType?: CompanyType
}
