import * as crypto from 'crypto'
import { ILicenseProps } from '../License/Infrastructure/Mongoose/Interfaces/License.interface'
import { SubLicense } from '../SubLicense/Infrastructure/Mongoose/Interfaces'

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface ISha256Hash {
  fields: string
  hash: string
}
export const generateHashLicenses = (licence: ILicenseProps): ISha256Hash => {
  const {
    name,
    type,
    companyIdentifier,
    cropType,
    accessibleIdentifier = [],
    startDate,
    endDate,
    hectareLimit,
    hectareLimitIdentifier = '',
    hectareMinIdentifier = '',
    countryId
  } = licence

  const dataToHash = {
    name,
    type,
    companyIdentifier,
    cropType,
    accessibleIdentifier: accessibleIdentifier.join(),
    startDate: new Date(startDate).getTime(),
    endDate: new Date(endDate).getTime(),
    hectareLimit,
    hectareLimitIdentifier,
    hectareMinIdentifier,
    countryId
  }
  return {
    fields: Object.keys(dataToHash).join(),
    hash: crypto
      .createHmac('sha256', 'licences')
      .update(JSON.stringify(dataToHash), 'utf8')
      .digest('hex')
  }
}

export const generateHashSubLicenses = (
  subLicense: SubLicense
): ISha256Hash => {
  const {
    licenseId,
    companyIdentifier,
    accessibleIdentifier = [],
    hectareLimit,
    companyUsers = [],
    status,
    image,
    idSublicense
  } = subLicense

  const dataToHash = {
    licenseId,
    companyIdentifier,
    accessibleIdentifier: accessibleIdentifier.join(),
    hectareLimit,
    status,
    image,
    idSublicense,
    companyUsers
  }
  return {
    fields: Object.keys(dataToHash).join(),
    hash: crypto
      .createHmac('sha256', 'licences')
      .update(JSON.stringify(dataToHash), 'utf8')
      .digest('hex')
  }
}

export const parseImageUrl = (imagePath) => {
  const pattern = new RegExp('^http')
  const patternAbsolutePath = new RegExp('^/')
  if (pattern.test(imagePath)) {
    return imagePath
  }
  if (patternAbsolutePath.test(imagePath)) {
    return `${process.env.BASE_URL}${imagePath}`
  }
  return `${process.env.BASE_URL}/${imagePath}`
}
