import { BaseCommand, flags } from '@adonisjs/core/build/standalone'
import CropRepository from 'App/Core/Crop/Infrastructure/Mongoose/Repositories'
import UserRepository from 'App/Core/User/Infrastructure/Mongoose/Repositories'
import RolRepository from 'App/Core/Rol/Infrastructure/Mongoose/Repositories'
import { ERoles } from 'App/Core/Rol/Infrastructure/Interfaces'
import { CompanyTypeEnum } from 'App/Core/CompanyType/Infrastructure/enums/CompanyType.enum'
import { existsSync } from 'fs'
import StorageRepository from 'App/Core/Storage'
import { getCropsCompaniesByUserAndIdentifier } from 'App/Core/Crop/utils/findCropsCompanyByUserAndIdentifierPipeline'
import { findUsersByCompanyTypePipelines } from 'App/Core/User/utils'

export default class AddCompanyRoleByCropMembership extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'users:add:companyRoles'

  /**
   * Command description is displayed in the "help" output
   */
  public static description =
    'Add roles by company depending on the role in the crop.'

  private nameFileBackupProducers: string = 'producer-update-company-roles.json'
  private nameFileBackupVerifiers: string = 'verifier-update-company-roles.json'

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

  private roleOptions = ['PRODUCER', 'VERIFIER', 'NONE']

  private getProgressBar(currentPercentage: number) {
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

  /**
   *
   * @param number index
   * @returns
   */
  private processingProgressBar(index: number): number {
    if (index < 100) {
      index++
      this.logger.logUpdate(
        `Processing: ${this.getProgressBar(index)} ${index}%`
      )
    }
    return index
  }

  public async rollback(): Promise<void> {
    this.logger.info(`Rollback for users`)
    const selectedRolName = await this.prompt.choice(
      'Select the role to rollback',
      this.roleOptions
    )

    if (selectedRolName === 'NONE') {
      this.exit()
    }
    let nameFileBackup = this.nameFileBackupProducers
    if (selectedRolName === ERoles.PRODUCER) {
      nameFileBackup = this.nameFileBackupProducers
    }
    if (selectedRolName === ERoles.VERIFIER) {
      nameFileBackup = this.nameFileBackupVerifiers
    }
    const filePath = await StorageRepository.getPath(nameFileBackup)
    if (!existsSync(filePath)) {
      this.logger.error(
        `Error: The rollBack file does not exist for role ${selectedRolName}`
      )
      this.exit()
    }

    const data = await StorageRepository.get(nameFileBackup)
    if (typeof data === 'object' && !data['users']) {
      this.logger.error(
        `Error: The rollBack for role ${selectedRolName} does not exist`
      )
      this.exit()
    }

    try {
      let index: number = 0
      const users = data['users']
      for (const user of users) {
        const { _id: userId, companies } = user

        if (selectedRolName === ERoles.PRODUCER) {
          const companiesToUpdate = companies.map((company) => {
            delete company.role
            return company
          })
          await UserRepository.findOneAndUpdate(
            { _id: userId },
            { $set: { companies: companiesToUpdate } }
          )
        }

        if (selectedRolName === ERoles.VERIFIER) {
          const user = await UserRepository.findOne({ _id: userId })
          const { companies: userCompanies } = user
          const rollbackedCompanies = userCompanies.filter((userCompany) => {
            return !companies.some(
              (companyToRollback) =>
                companyToRollback.company === userCompany.company.toString() ||
                companyToRollback.identifier === userCompany.identifier
            )
          })
          await UserRepository.findOneAndUpdate(
            { _id: userId },
            { $set: { companies: rollbackedCompanies } }
          )
        }
        index = this.processingProgressBar(index)
      }
    } catch (error) {
      this.logger.error(`Error: ${error}`)
    }
  }

  public async execute(): Promise<void> {
    let index = 0
    const selectedRolName = await this.prompt.choice(
      'Select the role to add company role equivalence',
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
    let nameFileBackup = this.nameFileBackupProducers

    let companyType = CompanyTypeEnum.PRODUCER
    if (selectedRolName === ERoles.PRODUCER) {
      companyType = CompanyTypeEnum.PRODUCER
      nameFileBackup = this.nameFileBackupProducers
    }

    if (selectedRolName === ERoles.VERIFIER) {
      companyType = CompanyTypeEnum.VERIFIERS
      nameFileBackup = this.nameFileBackupVerifiers
    }

    try {
      const resultsBack: any[] = []
      let companiesToAdd: any[] = []
      const cursor = await UserRepository.findWithAggregate(
        findUsersByCompanyTypePipelines(companyType),
        true
      )
      let user

      while ((user = await cursor.next())) {
        const { companiesWithType, companies, _id: userId } = user

        if (companiesWithType && companiesWithType.length > 0) {
          for (const company of companiesWithType) {
            const { identifier } = company
            const cropsPipeline = getCropsCompaniesByUserAndIdentifier(
              userId,
              identifier ?? ''
            )
            const userMemberInCompanies =
              await CropRepository.findWithAggregation(cropsPipeline)

            if (userMemberInCompanies.length) {
              const { companies: companiesWithMember, member } =
                userMemberInCompanies[0]

              const memberRole = roles.find(
                ({ value }) => value === member.type
              )

              const roleToAdd = roles.find(
                ({ equivalentRole }) =>
                  equivalentRole === memberRole?.equivalentRole
              )

              if (selectedRolName === ERoles.PRODUCER) {
                const companyToUpdate = companiesWithMember.find(
                  (company) => company.identifier === member.identifier
                )

                if (companyToUpdate && companies.length) {
                  const userCompanyIndex =
                    companies.findIndex(
                      (userCompany) =>
                        userCompany.company?.toString() ===
                          companyToUpdate._id.toString() ||
                        userCompany?.identifier === companyToUpdate.identifier
                    ) ?? -1

                  if (userCompanyIndex !== -1 && roleToAdd) {
                    const companies = [...user.companies]
                    companies[userCompanyIndex].role = roleToAdd?._id
                  }
                }
              }

              if (
                selectedRolName === ERoles.VERIFIER &&
                member.type === ERoles.VERIFIER
              ) {
                companiesWithMember.forEach(({ _id, identifier }) => {
                  const companyAlreadyAdded =
                    companiesToAdd.some(
                      (company) => company.identifier === identifier
                    ) ?? false

                  if (!companyAlreadyAdded) {
                    companiesToAdd.push({
                      company: _id,
                      identifier,
                      role: roleToAdd?._id,
                      isAdmin: false,
                      isResponsible: false
                    })
                  }
                })
              }
            }
          }

          if (selectedRolName === ERoles.PRODUCER) {
            await UserRepository.findOneAndUpdate(
              { _id: userId },
              { $set: { companies } }
            )

            resultsBack.push({
              _id: userId,
              companies
            })
          }

          if (selectedRolName === ERoles.VERIFIER) {
            await UserRepository.findOneAndUpdate(
              { _id: userId },
              { $push: { companies: companiesToAdd } }
            )

            resultsBack.push({
              _id: userId,
              companies: companiesToAdd
            })
          }
        }
        index = this.processingProgressBar(index)
      }

      let data = {}

      const filePath = await StorageRepository.getPath(nameFileBackup)
      if (existsSync(filePath)) {
        data = await StorageRepository.get(nameFileBackup)
      }
      data['users'] = resultsBack
      await StorageRepository.create(data, nameFileBackup)
    } catch (error) {
      console.log(error)
      this.logger.error(`Error: ${error}`)
    }
  }

  public async run() {
    // this.logger.info('Started adding user roles for companies.')
    this.logger.info('No Execute.')
    await this.exit()
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
    }
    this.logger.logUpdatePersist()
    this.logger.success('Add user roles for companies finished.')
  }
}
