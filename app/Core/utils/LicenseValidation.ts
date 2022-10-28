import ClauseRepository from 'App/Core/Clauses/Infrastructure/Mongoose/Repositories'
import UserRepository from 'App/Core/User/Infrastructure/Mongoose/Repositories'
import CompanyRepository from 'App/Core/Company/Infrastructure/Mongoose/Repositories'
import CropTypeRepository from 'App/Core/CropType/Infraestructure/Mongoose/Repositories'
import VerificationTypeRepository from '../VerificationType/Infrastructure/Mongoose/Repositories'
import LicenseRepository from '../License/Infrastructure/Mongoose/Repositories'
import { CompanyTypeEnum } from '../Company/Infrastructure/Mongoose/Interfaces/Company.interface'
import { findUserByCompanyIdPipelines } from 'App/Core/User/utils'

export const validateIdentifiers = async (row) => {
  const identifierErrors: any = []

  const accessibleIdentifier: any = []
  const inaccessibleIdentifier: any = []
  const accessibleIdentifierInRow = row.accessibleIdentifier
    ? row.accessibleIdentifier.split(';').map((item) => item.trim())
    : []
  const inaccessibleIdentifierInRow = row.InaccessibleIdentifier
    ? row.InaccessibleIdentifier.split(';').map((item) => item.trim())
    : []

  const identifiersList = accessibleIdentifierInRow.concat(
    accessibleIdentifierInRow
  )
  const companiesInDB = await CompanyRepository.findAll({
    identifier: { $in: identifiersList }
  })
  if (accessibleIdentifierInRow.length) {
    for (const item of accessibleIdentifierInRow) {
      const identifier = item.trim()
      if (identifier) {
        const company = await companiesInDB.find(
          (company) => identifier === company.identifier
        )
        if (!company) {
          identifierErrors.push({
            success: false,
            name: row.name.trim(),
            error: `El empresa con identifier <${identifier}> en accessibleIdentifier, no existe`
          })
          continue
        }
        accessibleIdentifier.push(String(company._id))
      }
    }
  }

  if (inaccessibleIdentifierInRow.length) {
    for (const identifier of inaccessibleIdentifierInRow) {
      if (identifier) {
        const company = await companiesInDB.find(
          (company) => identifier === company.identifier
        )
        if (!company) {
          identifierErrors.push({
            success: false,
            name: row.name.trim(),
            error: `El empresa con identifier <${identifier}> en InaccessibleIdentifier, no existe`
          })
          continue
        }
        inaccessibleIdentifier.push(company._id)
      }
    }
  }

  return {
    identifierErrors,
    accessibleIdentifier,
    inaccessibleIdentifier
  }
}

export const validateClauses = async (row) => {
  const clauseErrors: any = []
  const clauses: any = []
  const clausesInRow = row.title_clauses
    ? row.title_clauses.split(';').map((item) => item.trim())
    : []
  for (const id_clause of clausesInRow) {
    if (id_clause) {
      const clause = await ClauseRepository.findOne({ id_clause })
      if (!clause) {
        clauseErrors.push({
          success: false,
          name: row.name.trim(),
          error: `la id_clause: <${id_clause}> no existe`
        })
        continue
      }
      clauses.push(String(clause._id))
    }
  }
  return {
    clauseErrors,
    clauses
  }
}

export const validateUsers = async (row) => {
  const userErrors: any = []
  const companyUsers: any = []
  const companyUsersInRow = row.companyUsers
    ? row.companyUsers.split(';').map((item) => item.trim())
    : []

  const companyUsersInBD = await UserRepository.findAll({
    email: { $in: companyUsersInRow }
  })

  for (const email of companyUsersInRow) {
    if (email) {
      const user = await companyUsersInBD.find(
        (userInDB) => email === userInDB.email
      )
      if (!user) {
        userErrors.push({
          success: false,
          name: row.name.trim(),
          error: `El usuario con email <${email}> no existe`
        })
        continue
      }
      companyUsers.push(String(user._id))
    }
  }
  return {
    userErrors,
    companyUsers
  }
}

export const validateVerificationType = async (row) => {
  const verificationTypeErrors: any = []
  const verificationTypeInRow: any = row.verificationType
  const cropTypeInRow = row.cropType

  const cropTypeInBD = await CropTypeRepository.findOne({
    key: cropTypeInRow
  })
  const verificationTypeInBD = await VerificationTypeRepository.findOne({
    key: verificationTypeInRow
  })

  if (!verificationTypeInBD) {
    verificationTypeErrors.push({
      success: false,
      verificationType: verificationTypeInRow,
      error: `El tipo de verificacion <${verificationTypeInRow}> no existe`
    })
  }

  let hasCropType = false
  if (verificationTypeInBD) {
    const { cropTypes } = verificationTypeInBD
    hasCropType = cropTypes.some(
      ({ cropType }: any) => cropTypeInBD._id.toString() === cropType.toString()
    )
  }

  if (!hasCropType) {
    verificationTypeErrors.push({
      success: false,
      verificationType: verificationTypeInRow,
      error: `El tipo de verificacion <${verificationTypeInRow}> no puede ser aplicado al cropType <${cropTypeInRow}>`
    })
  }

  return {
    verificationTypeErrors,
    verificationTypeInBD
  }
}

export const validateLicense = async (row) => {
  let licenseError = { success: true, id_license: 0, error: '' }
  const licenseInRow = row.id_license

  const licenseInBD = await LicenseRepository.findOneSelect({
    idLicense: licenseInRow
  })

  if (!licenseInBD) {
    licenseError = {
      success: false,
      id_license: licenseInRow,
      error: `la licencia con id_license <${licenseInRow}> no existe`
    }
  }

  return {
    licenseError,
    licenseInBD
  }
}

export const validateVerifierCompaniesAndUsers = async (row) => {
  const verifierCompaniesErrors: any = []
  const verifierCompanies: any = []
  const verificationTypeInRow = row.verificationType
  const verificationTypeInBD = await VerificationTypeRepository.findOne({
    key: verificationTypeInRow
  })

  const companyInRow = row.verifierCompany
  const companyInBD = await CompanyRepository.findOneTypes({
    identifier: companyInRow
  })

  if (!companyInBD) {
    verifierCompaniesErrors.push({
      success: false,
      company: companyInRow,
      error: `la compania: <${companyInRow}> no existe`
    })
  }

  let companyHasVerificationType = false

  if (verificationTypeInBD && verificationTypeInBD.companies.length) {
    const { companies } = verificationTypeInBD
    companyHasVerificationType = companies.some((verifierCompany) => {
      return verifierCompany.company.toString() === companyInBD._id.toString()
    })
  }

  if (!companyHasVerificationType) {
    verifierCompaniesErrors.push({
      success: false,
      company: companyInRow,
      error: `la compania: <${companyInRow}> no tiene disponible el tipo de verificacion`
    })
  }

  let isVerifierCompany = false
  const { types: companyTypes } = companyInBD

  if (companyTypes) {
    isVerifierCompany = companyTypes.some(
      (type: any) => type.name === CompanyTypeEnum.VERIFIERS
    )
  }
  if (!isVerifierCompany) {
    verifierCompaniesErrors.push({
      success: false,
      company: companyInRow,
      error: `la compania: <${companyInRow}> no es verificadora`
    })
  }

  let verifierUsers: any = []
  const verifierUsersInRow = row.verifierUsers
    ? row.verifierUsers.split(';').map((item) => item.trim())
    : []
  const companyUsers = await UserRepository.findWithAggregate(
    findUserByCompanyIdPipelines(companyInBD._id)
  )

  const usersInBD = await UserRepository.findAll({
    email: { $in: verifierUsersInRow }
  })
  const companyUsersIds = companyUsers.map((user: any) => user._id.toString())
  const usersInBDIds = usersInBD.map(({ _id }) => _id.toString())
  const usersBelongsCompany = usersInBDIds.some((verifieriUserId) =>
    companyUsersIds.some((companyUserId) => verifieriUserId === companyUserId)
  )
  if (!usersBelongsCompany) {
    verifierCompaniesErrors.push({
      success: false,
      users: verifierUsersInRow,
      error: `uno o alguno de los usuarios no pertenecen a la compania verificadora`
    })
  }
  verifierUsers = usersInBD.map(({ _id }) => {
    return { user: _id, identifier: companyInBD.identifier }
  })
  verifierCompanies.push({
    company: String(companyInBD._id),
    verifierUsers
  })

  return {
    verifierCompaniesErrors,
    verifierCompanies
  }
}
