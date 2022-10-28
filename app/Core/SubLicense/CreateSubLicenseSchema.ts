import { objectIdPattern } from 'App/utils/utils'
import Joi from 'joi'
import { SubLicenseStatus } from './Infrastructure/Mongoose/Interfaces/SubLicense.interface'

export const createSubLicenseSchemaParams = Joi.object({
  id: Joi.string().regex(objectIdPattern(), 'Invalid ObjectId').required()
})

export const createSubLicenseSchema = Joi.object({
  licenseId: Joi.string().regex(objectIdPattern(), 'Invalid ObjectId'),
  companyId: Joi.string().regex(objectIdPattern(), 'Invalid ObjectId'),
  companyIdentifier: Joi.string().required(),
  accessibleIdentifier: Joi.alternatives().try(
    Joi.array().optional(),
    Joi.array().items(
      Joi.string().regex(objectIdPattern(), 'Invalid ObjectId').required()
    )
  ),
  inaccessibleIdentifier: Joi.alternatives().try(
    Joi.array().optional(),
    Joi.array().items(
      Joi.string().regex(objectIdPattern(), 'Invalid ObjectId').required()
    )
  ),
  companyUsers: Joi.array()
    .items(Joi.string().regex(objectIdPattern(), 'Invalid ObjectId').required())
    .required(),
  status: Joi.string()
    .optional()
    .valid(...[SubLicenseStatus.ACTIVE, SubLicenseStatus.PENDING]),
  hectareLimit: Joi.number().greater(0).required(),
  hectareMinIdentifier: Joi.number()
    .min(0)
    .max(Joi.ref('hectareLimitIdentifier'))
    .optional(),
  hectareLimitIdentifier: Joi.number()
    .min(0)
    .max(Joi.ref('hectareLimit'))
    .optional(),
  image: Joi.string()
})
