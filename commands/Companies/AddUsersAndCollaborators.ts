import { BaseCommand, flags } from '@adonisjs/core/build/standalone'
import RolRepository from 'App/Core/Rol/Infrastructure/Mongoose/Repositories'
import StorageService from 'App/Core/Storage/Services/StorageService'
import CompanyRepository from 'App/Core/Company/Infrastructure/Mongoose/Repositories'
import { ERoles } from 'App/Core/Rol/Infrastructure/Interfaces/Rol.enum'
import { existsSync } from 'fs'
import UserRepository from 'App/Core/User/Infrastructure/Mongoose/Repositories'
import { findUsersByCompanyTypePipelines } from 'App/Core/User/utils/findUsersByCompanyTypePipelines'
import { CompanyTypeEnum } from 'App/Core/CompanyType/Infrastructure/enums/CompanyType.enum'
import CropRepository from 'App/Core/Crop/Infrastructure/Mongoose/Repositories'
import { getCropsCompaniesByUserAndIdentifier } from 'App/Core/Crop/utils/findCropsCompanyByUserAndIdentifierPipeline'
import { Roles } from 'App/Core/Rol/Infrastructure/Interfaces/Rol.interface'
import { findUsersWithCompaniesAndLicenses } from '../../app/Core/User/utils/findUsersWithCompaniesAndLicenses'
import {
  CompanyCollaborator,
  CompanyUser
} from 'App/Core/Company/Infrastructure/Mongoose/Interfaces/Company.interface'

export default class AddUsersAndCollaborators extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'add:users:collaborators:in:companies'

  /**
   * Command description is displayed in the "help" output
   */
  public static description =
    'Command to add users and collaborators to company by role'

  private nameFileBackupProducers: string =
    'company-users-and-collaborators.json'

  private nameFileBackupKams: string =
    'company-users-and-collaborators-kam.json'

  private nameFileBackupProducerAdviser: string =
    'company-users-and-collaborators-producer-advisers.json'

  private nameFileBackupVerifiers: string =
    'company-users-and-collaborators-verfiers.json'

  private nameFileBackupMarketers: string =
    'company-users-and-collaborators-marketers.json'

  private roleOptions = [
    'PRODUCER',
    'KAM',
    'PRODUCER_ADVISER',
    'VERIFIER',
    'MARKETER',
    'NONE'
  ]

  @flags.boolean({ alias: 'r', description: 'Rollback flag' })
  public rollbackCommand: boolean

  public static settings = {
    /**
     * Set the following value to true, if you want to load the application
     * before running the command
     */
    loadApp: true,

    /**
     * Set the following value to true, if you want this command to keep running until
     * you manually decide to exit the process
     */
    stayAlive: false
  }

  private getProgressBar(currentPercentage: number): string {
    /**
     * Draw one cell for almost every 3%. This is to ensure the
     * progress bar renders fine on smaller terminal width
     */
    const completed = Math.ceil(currentPercentage / 3)
    const incomplete = Math.ceil((100 - currentPercentage) / 3)
    return `[${new Array(completed).join('=')}${new Array(incomplete).join(
      ' '
    )}]`
  }

  public scriptErrors: any[] = []

  /**
   *
   * @param number index
   * @param limit index
   *
   * @returns
   */
  private processingProgressBar(index: number, limit: number): number {
    if (index < limit) {
      index++
      const currentPercentage = Number(((index * 100) / limit).toFixed(2))
      this.logger.logUpdate(
        `Processing: ${this.getProgressBar(
          currentPercentage
        )} ${currentPercentage}% | ${index}/${limit}`
      )
    }
    return index
  }

  public async rollback(): Promise<void> {
    let index = 0
    let nameFileBackup: string = this.nameFileBackupProducers
    const selectedRolName = await this.prompt.choice(
      'Select the role to add company users or collaborators',
      this.roleOptions
    )

    if (selectedRolName === 'NONE') {
      this.exit()
    }

    if (selectedRolName === ERoles.PRODUCER) {
      nameFileBackup = this.nameFileBackupProducers
    }

    if (selectedRolName === ERoles.KAM) {
      nameFileBackup = this.nameFileBackupKams
    }

    if (selectedRolName === ERoles.PRODUCER_ADVISER) {
      nameFileBackup = this.nameFileBackupProducerAdviser
    }

    if (selectedRolName === ERoles.VERIFIER) {
      nameFileBackup = this.nameFileBackupVerifiers
    }

    let companies = await StorageService.get(nameFileBackup)

    if (!companies && !companies.length) {
      this.logger.error(`Error: The rollBack data does not exist`)
      this.exit()
    }

    for (const item of companies) {
      index = this.processingProgressBar(index, companies.length)
      await CompanyRepository.updateOne(
        { _id: item.companyId },
        { $set: item.toSetData }
      )
    }
  }

  private async addProducersToCompanies(
    participatingCropData: any,
    { user, companyInUserId, companyInUserIdentifier }: any,
    roleToAdd: Roles,
    nameFileBackup: string
  ): Promise<void> {
    const { companies: companiesInUser } = user
    const {
      companies: participatingCompanies,
      member,
      members: membersInCrop
    } = participatingCropData

    for (const participatingCompany of participatingCompanies) {
      const userHasCompany = companiesInUser.find(
        (userCompany) =>
          String(userCompany.company) === String(participatingCompany._id) ||
          userCompany.identifier === participatingCompany.identifier
      )

      const belongsToCompany =
        participatingCompany?.users?.some(
          (companyUser) => String(companyUser.user) === String(user._id)
        ) ?? false

      const collaborateInCompany =
        participatingCompany?.collaborators?.some(
          (companyUser) => String(companyUser.user) === String(user._id)
        ) ?? false

      if (
        !collaborateInCompany &&
        !belongsToCompany &&
        member.type.toLowerCase() === ERoles.PRODUCER.toLowerCase()
      ) {
        const isAdmin = userHasCompany?.isAdmin ?? false

        if (isAdmin) {
          const flattenMembers = membersInCrop?.flatMap((item) => item) ?? []

          const hasProducerAdviserRole =
            flattenMembers.some(
              (member) => member.type === ERoles.PRODUCER_ADVISER
            ) ?? false

          if (hasProducerAdviserRole) {
            continue
          }
        }

        const backupCompanies = await StorageService.get(nameFileBackup)

        const alreadyInBackup =
          backupCompanies.length &&
          backupCompanies.some(
            (backupCompany) =>
              backupCompany.identifier === participatingCompany.identifier
          )

        if (!alreadyInBackup) {
          await StorageService.add(
            {
              companyId: participatingCompany._id,
              toSetData: {
                users: participatingCompany?.users ?? [],
                collaborators: participatingCompany?.collaborators ?? []
              }
            },
            nameFileBackup
          )
        }

        if (userHasCompany) {
          const userToAdd: CompanyUser = {
            isAdmin,
            isResponsible: false,
            user: user._id,
            role: roleToAdd?._id ?? ''
          }

          await CompanyRepository.findOneAndUpdate(
            { _id: participatingCompany._id },
            { $push: { users: userToAdd } }
          )
        } else {
          const userToAdd: CompanyCollaborator = {
            isAdmin,
            isResponsible: false,
            user: user._id,
            role: roleToAdd?._id ?? '',
            company: companyInUserId,
            identifier: companyInUserIdentifier
          }

          await CompanyRepository.findOneAndUpdate(
            { _id: participatingCompany._id },
            { $push: { collaborators: userToAdd } }
          )
        }
      }
    }
  }

  private async addProducerAdvisersToCompanies(
    participatingCropData: any,
    user: any,
    roleToAdd: any,
    nameFileBackup: string
  ): Promise<void> {
    const { companies: companiesInUser } = user
    const { companies: participatingCompanies, members: membersInCrop } =
      participatingCropData

    for (const participatingCompany of participatingCompanies) {
      const userBelongToCompany = companiesInUser.find(
        (userCompany) =>
          String(userCompany.company) === String(participatingCompany._id) ||
          userCompany.identifier === participatingCompany.identifier
      )

      const alreadyInCompany =
        participatingCompany?.users?.some(
          (companyUser) => String(companyUser.user) === String(user._id)
        ) ?? false

      const flattenMembers = membersInCrop?.flatMap((item) => item) ?? []

      const companyMember = flattenMembers?.find(
        (member) => member.cropIdentifier === participatingCompany.identifier
      )

      if (
        !alreadyInCompany &&
        companyMember.type.toLowerCase() ===
          ERoles.PRODUCER_ADVISER.toLowerCase() &&
        userBelongToCompany
      ) {
        const userToAdd = {
          isAdmin: false,
          isResponsible: false,
          user: user._id,
          role: roleToAdd?._id
        }

        const backupCompanies = await StorageService.get(nameFileBackup)

        const alreadyInBackup =
          backupCompanies.length &&
          backupCompanies.some(
            (backupCompany) =>
              backupCompany.identifier === participatingCompany.identifier
          )

        if (!alreadyInBackup) {
          await StorageService.add(
            {
              companyId: participatingCompany._id,
              toSetData: {
                users: participatingCompany?.users ?? [],
                collaborators: participatingCompany?.collaborators ?? []
              }
            },
            nameFileBackup
          )
        }

        await CompanyRepository.findOneAndUpdate(
          { _id: participatingCompany._id },
          { $push: { users: userToAdd } }
        )
      }
    }
  }

  private async addVerifiersToCompanies(
    participatingCropData: any,
    { user, companyInUserId, companyInUserIdentifier }: any,
    roleToAdd: any,
    nameFileBackup: string
  ): Promise<void> {
    const { companies: participatingCompanies, members: membersInCrop } =
      participatingCropData

    for (const participatingCompany of participatingCompanies) {
      const alreadyInCompany =
        participatingCompany?.users?.some(
          (companyUser) => String(companyUser.user) === String(user._id)
        ) ?? false

      const alreadyCollaboratingInCompany =
        participatingCompany?.collaborators?.some(
          (companyUser) => String(companyUser.user) === String(user._id)
        ) ?? false

      const flattenMembers = membersInCrop?.flatMap((item) => item) ?? []

      const companyMember = flattenMembers?.find(
        (member) => member.cropIdentifier === participatingCompany.identifier
      )

      if (
        !alreadyInCompany &&
        !alreadyCollaboratingInCompany &&
        companyMember.type.toLowerCase() === ERoles.VERIFIER.toLowerCase()
      ) {
        const userToAdd = {
          isAdmin: false,
          isResponsible: false,
          user: user._id,
          role: roleToAdd?._id,
          company: companyInUserId,
          identifier: companyInUserIdentifier
        }

        const backupCompanies = await StorageService.get(nameFileBackup)

        const alreadyInBackup =
          backupCompanies.length &&
          backupCompanies.some(
            (backupCompany) =>
              backupCompany.identifier === participatingCompany.identifier
          )

        if (!alreadyInBackup) {
          await StorageService.add(
            {
              companyId: participatingCompany._id,
              toSetData: {
                users: participatingCompany?.users ?? [],
                collaborators: participatingCompany?.collaborators ?? []
              }
            },
            nameFileBackup
          )
        }

        const isVerifierCompany =
          participatingCompany.types[0]?.name === CompanyTypeEnum.VERIFIERS

        const isProducerCompany =
          participatingCompany.types[0]?.name === CompanyTypeEnum.PRODUCER

        if (isVerifierCompany) {
          await CompanyRepository.findOneAndUpdate(
            { _id: participatingCompany._id },
            { $push: { users: userToAdd } }
          )
        } else if (isProducerCompany) {
          await CompanyRepository.findOneAndUpdate(
            { _id: participatingCompany._id },
            { $push: { collaborators: userToAdd } }
          )
        } else {
          this.scriptErrors.push({
            error: true,
            message: `The company is not type verifier or producer}`,
            identifier: participatingCompany.identifier,
            user: user.email
          })
        }
      }
    }
  }

  private async addMarketersToCompanies(
    participatingCropData: any,
    { user, companyInUserId, companyInUserIdentifier }: any,
    roleToAdd: any,
    nameFileBackup: string
  ): Promise<void> {
    const { companies: participatingCompanies, members: membersInCrop } =
      participatingCropData

    for (const participatingCompany of participatingCompanies) {
      const alreadyInCompany =
        participatingCompany?.users?.some(
          (companyUser) => String(companyUser.user) === String(user._id)
        ) ?? false

      const alreadyCollaboratingInCompany =
        participatingCompany?.collaborators?.some(
          (companyUser) => String(companyUser.user) === String(user._id)
        ) ?? false

      const flattenMembers = membersInCrop?.flatMap((item) => item) ?? []

      const companyMember = flattenMembers?.find(
        (member) => member.cropIdentifier === participatingCompany.identifier
      )

      if (
        !alreadyInCompany &&
        !alreadyCollaboratingInCompany &&
        companyMember.type.toLowerCase() === ERoles.MARKETER.toLowerCase()
      ) {
        const userToAdd = {
          isAdmin: false,
          isResponsible: false,
          user: user._id,
          role: roleToAdd?._id,
          company: companyInUserId,
          identifier: companyInUserIdentifier
        }

        const backupCompanies = await StorageService.get(nameFileBackup)

        const alreadyInBackup =
          backupCompanies.length &&
          backupCompanies.some(
            (backupCompany) =>
              backupCompany.identifier === participatingCompany.identifier
          )

        if (!alreadyInBackup) {
          await StorageService.add(
            {
              companyId: participatingCompany._id,
              toSetData: {
                users: participatingCompany?.users ?? [],
                collaborators: participatingCompany?.collaborators ?? []
              }
            },
            nameFileBackup
          )
        }

        await this.updateRelationshipWithCompany(user, participatingCompany)

        if (companyMember.identifier === participatingCompany.identifier) {
          await CompanyRepository.findOneAndUpdate(
            { _id: participatingCompany._id },
            { $push: { users: userToAdd } }
          )
        } else {
          await CompanyRepository.findOneAndUpdate(
            { _id: participatingCompany._id },
            { $push: { collaborators: userToAdd } }
          )
        }
      }
    }
  }

  private async addKamsToCompanies(
    participatingCropData: any,
    { user, companyInUserId, companyInUserIdentifier }: any,
    roleToAdd: any,
    nameFileBackup: string
  ): Promise<void> {
    const { companies: participatingCompanies, members: membersInCrop } =
      participatingCropData

    for (const participatingCompany of participatingCompanies) {
      const isCompanyUser =
        participatingCompany?.users?.some(
          (companyUser) => String(companyUser.user) === String(user._id)
        ) ?? false

      const isCompanyCollaborator =
        participatingCompany?.collaborators?.some(
          (companyUser) => String(companyUser.user) === String(user._id)
        ) ?? false

      const flattenMembers = membersInCrop?.flatMap((item) => item) ?? []

      const companyMember = flattenMembers?.find(
        (member) => member.cropIdentifier === participatingCompany.identifier
      )

      if (
        !isCompanyUser &&
        !isCompanyCollaborator &&
        companyMember?.type.toLowerCase() === ERoles.KAM.toLowerCase()
      ) {
        const userToAdd = {
          isAdmin: false,
          isResponsible: false,
          user: user._id,
          role: roleToAdd?._id,
          company: companyInUserId,
          identifier: companyInUserIdentifier
        }

        const backupCompanies = await StorageService.get(nameFileBackup)

        const alreadyInBackup =
          backupCompanies.length &&
          backupCompanies.some(
            (backupCompany) =>
              backupCompany.identifier === participatingCompany.identifier
          )

        if (!alreadyInBackup) {
          await StorageService.add(
            {
              companyId: participatingCompany._id,
              toSetData: {
                users: participatingCompany?.users ?? [],
                collaborators: participatingCompany?.collaborators ?? []
              }
            },
            nameFileBackup
          )
        }

        const isUcropitCompany =
          participatingCompany.types[0]?.name === CompanyTypeEnum.UCROPIT

        const isProducerCompany =
          participatingCompany.types[0]?.name === CompanyTypeEnum.PRODUCER

        if (isUcropitCompany) {
          await CompanyRepository.findOneAndUpdate(
            { _id: participatingCompany._id },
            { $push: { users: userToAdd } }
          )
        } else if (isProducerCompany) {
          await CompanyRepository.findOneAndUpdate(
            { _id: participatingCompany._id },
            { $push: { collaborators: userToAdd } }
          )
        } else {
          this.scriptErrors.push({
            error: true,
            message: `The company is not type ucropit or producer}`,
            identifier: participatingCompany.identifier,
            user: user.email
          })
        }
      }
    }
  }

  public async execute(): Promise<void> {
    let index = 0
    let companyType = CompanyTypeEnum.PRODUCER
    let nameFileBackup: string = this.nameFileBackupProducers
    let roleToAdd
    const selectedRolName = await this.prompt.choice(
      'Select the role to add company users or collaborators',
      this.roleOptions
    )

    if (selectedRolName === 'NONE') {
      this.exit()
    }

    const roles = await RolRepository.findAll({})
    if (!roles.length) {
      this.logger.error(`User Roles not exist`)
      this.exit()
    }
    const selectedRoleExist = roles.some(
      (role) => role.value === selectedRolName
    )

    if (!selectedRoleExist) {
      this.logger.error(`The role selected does not exist`)
      this.exit()
    }

    if (selectedRolName === ERoles.PRODUCER) {
      companyType = CompanyTypeEnum.PRODUCER
      nameFileBackup = this.nameFileBackupProducers
      roleToAdd = roles.find((role) => role.value === ERoles.PRODUCER)
    }

    if (selectedRolName === ERoles.KAM) {
      companyType = CompanyTypeEnum.UCROPIT
      nameFileBackup = this.nameFileBackupKams
      roleToAdd = roles.find((role) => role.value === ERoles.TECHNICAL_ADVISER)
    }

    if (selectedRolName === ERoles.PRODUCER_ADVISER) {
      companyType = CompanyTypeEnum.PRODUCER
      nameFileBackup = this.nameFileBackupProducerAdviser
      const cropRole = roles.find(
        (role) => role.value === ERoles.PRODUCER_ADVISER
      )
      roleToAdd = roles.find((role) => role.value === cropRole?.equivalentRole)
    }

    if (selectedRolName === ERoles.VERIFIER) {
      companyType = CompanyTypeEnum.VERIFIERS
      nameFileBackup = this.nameFileBackupVerifiers
      const cropRole = roles.find((role) => role.value === ERoles.VERIFIER)
      roleToAdd = roles.find((role) => role.value === cropRole?.equivalentRole)
    }

    if (selectedRolName === ERoles.MARKETER) {
      nameFileBackup = this.nameFileBackupMarketers
      const cropRole = roles.find((role) => role.value === ERoles.MARKETER)
      roleToAdd = roles.find((role) => role.value === cropRole?.equivalentRole)
    }

    if (!existsSync(`${process.cwd()}/tmp/${nameFileBackup}`)) {
      await StorageService.create([], nameFileBackup)
    }
    const usersPipeline =
      selectedRolName !== ERoles.MARKETER
        ? findUsersByCompanyTypePipelines(companyType)
        : findUsersWithCompaniesAndLicenses()

    const users: any[] = await UserRepository.findWithAggregate(usersPipeline)

    if (!users.length) {
      this.logger.info(
        `Users Not Found for companyType ${companyType} rol ${selectedRolName}`
      )
      await this.exit()
    }

    for (const user of users) {
      index = this.processingProgressBar(index, users.length)
      const { companiesWithType } = user
      for (const company of companiesWithType) {
        const { identifier: companyInUserIdentifier, _id: companyInUserId } =
          company
        const companiesWithUserParticipate: any =
          await CropRepository.findWithAggregate(
            getCropsCompaniesByUserAndIdentifier(
              user._id,
              companyInUserIdentifier
            )
          )

        if (companiesWithUserParticipate.length) {
          if (selectedRolName === ERoles.PRODUCER) {
            await this.addProducersToCompanies(
              companiesWithUserParticipate[0],
              { user, companyInUserId, companyInUserIdentifier },
              roleToAdd,
              nameFileBackup
            )
          }

          if (selectedRolName === ERoles.KAM) {
            await this.addKamsToCompanies(
              companiesWithUserParticipate[0],
              { user, companyInUserId, companyInUserIdentifier },
              roleToAdd,
              nameFileBackup
            )
          }

          if (selectedRolName === ERoles.PRODUCER_ADVISER) {
            await this.addProducerAdvisersToCompanies(
              companiesWithUserParticipate[0],
              user,
              roleToAdd,
              nameFileBackup
            )
          }

          if (selectedRolName === ERoles.VERIFIER) {
            await this.addVerifiersToCompanies(
              companiesWithUserParticipate[0],
              { user, companyInUserId, companyInUserIdentifier },
              roleToAdd,
              nameFileBackup
            )
          }

          if (selectedRolName === ERoles.MARKETER) {
            await this.addMarketersToCompanies(
              companiesWithUserParticipate[0],
              { user, companyInUserId, companyInUserIdentifier },
              roleToAdd,
              nameFileBackup
            )
          }

          if (selectedRolName === ERoles.MARKETER) {
            await this.addVerifiersToCompanies(
              companiesWithUserParticipate[0],
              { user, companyInUserId, companyInUserIdentifier },
              roleToAdd,
              nameFileBackup
            )
          }
        }
      }
    }

    if (this.scriptErrors.length) {
      this.logger.error(`Errors:`)
      console.log(this.scriptErrors)
    }
  }

  private async updateRelationshipWithCompany(user, company) {
    const { _id: userId, companies = [] } = user
    const hasRelationshipWithCompany = companies.some(
      (item) => String(item.company) === String(company._id)
    )

    if (!hasRelationshipWithCompany) {
      UserRepository.findOneAndUpdate(
        { _id: userId },
        {
          $addToSet: {
            companies: {
              isAdmin: false,
              identifier: company.identifier,
              company: company._id
            }
          }
        }
      ).catch(console.log)
    }
  }

  public async run() {
    try {
      if (this.rollbackCommand) {
        this.logger.success('Started rollback roles')
        await this.rollback()
      } else {
        await this.execute()
      }
    } catch (error) {
      this.logger.error(`Error Message: ${error.message}`)
      this.logger.error(`Error: ${error}`)
      console.log(error)
    }
    this.logger.logUpdatePersist()
    this.logger.success('Add user roles for companies finished.')
  }
}
