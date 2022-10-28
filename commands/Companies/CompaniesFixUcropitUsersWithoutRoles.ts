import { BaseCommand, flags } from '@adonisjs/core/build/standalone'
import CompanyRepository from 'App/Core/Company/Infrastructure/Mongoose/Repositories'
import StorageService from 'App/Core/Storage/Services/StorageService'
import RolRepository from 'App/Core/Rol/Infrastructure/Mongoose/Repositories'
import { ERoles } from 'App/Core/Rol/Infrastructure/Interfaces'
import { CompanyTypeEnum } from 'App/Core/CompanyType/Infrastructure/enums/CompanyType.enum'
import CompanyTypeRepository from 'App/Core/CompanyType/Infrastructure/Mongoose/Repositories'

export default class CompaniesFixUcropitUsersWithoutRoles extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'companies:fix:ucropit:users:without:roles'

  /**
   * Command description is displayed in the "help" output
   */
  public static description =
    'Correcting user KAM ucropit companies with company cazenave'

  private nameFileBackup: string =
    'companies-fix-ucropit-users-without-roles.json'

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

  private fromIdentifier: any = null
  private forIdentifier: any = null

  private companiesUcropits = [
    {
      name: 'UCROPIT',
      fromIdentifier: '30716983702',
      forIdentifier: '30716983702'
    },
    {
      name: 'Garamendy',
      fromIdentifier: '801174732',
      forIdentifier: '801174732'
    },
    {
      name: 'From Cazenave for UCROPIT',
      fromIdentifier: '30619765555',
      forIdentifier: '30716983702'
    },
    {
      name: 'From UCROPIT for Garamendy',
      fromIdentifier: '30716983702',
      forIdentifier: '801174732'
    },
    {
      name: 'NONE',
      fromIdentifier: null,
      forIdentifier: null
    }
  ]

  public setCompanyUcropit(selectedCompany) {
    const company = this.companiesUcropits.find(
      (item) => item.name === selectedCompany
    )
    this.fromIdentifier = company?.fromIdentifier
    this.forIdentifier = company?.forIdentifier
  }

  public async run() {
    this.logger.info('Started adding users in companies.')
    try {
      const selectedCompany = await this.prompt.choice(
        'Select company',
        this.companiesUcropits.map((item) => item.name)
      )

      if (selectedCompany === 'NONE') {
        await this.exit()
      }
      this.setCompanyUcropit(selectedCompany)
      if (this.rollbackCommand) {
        this.logger.success('Started rollback companies')
        await this.rollback()
      } else {
        await this.execute()
      }
    } catch (error) {
      this.logger.error(`Error Message: ${error.message}`)
      this.logger.error(`Error: ${error}`)
    }
    this.logger.logUpdatePersist()
    this.logger.success('Add user in companies finished.')
  }

  public async rollback(): Promise<void> {
    try {
      let i: number = 0

      let companies = await StorageService.get(this.nameFileBackup)
      for (const company of companies) {
        i = this.processingProgressBar(i, companies.length)
        await CompanyRepository.updateOne(
          { _id: company._id },
          {
            $set: {
              collaborators: company?.collaborators ?? []
            }
          }
        )
      }
    } catch (err) {
      this.logger.error(err)
      this.exit()
    }
  }

  public async execute(): Promise<void> {
    let i: number = 0

    const forCompany = await CompanyRepository.findOne({
      identifier: this.forIdentifier
    })

    if (!forCompany) {
      this.logger.info(
        `The company identifier: ${this.forIdentifier} dont exist`
      )
      this.exit()
    }

    const fromCompany = await CompanyRepository.findOne({
      identifier: this.fromIdentifier
    })

    if (!fromCompany) {
      this.logger.info(
        `The company identifier: ${this.fromIdentifier} dont exist`
      )
      this.exit()
    }

    const adviserRole = await RolRepository.findOne({ value: ERoles.ADVISER })

    if (!adviserRole) {
      this.logger.info('The adviser role is not registered in the database')
      this.exit()
    }

    const fileExists = await StorageService.fileExists(this.nameFileBackup)
    if (!fileExists) {
      await StorageService.create([], this.nameFileBackup)
    }

    await StorageService.add(forCompany, this.nameFileBackup)

    const { users: forCompanyUsers = [] } = forCompany

    let companyType = await CompanyTypeRepository.findOne({
      name: CompanyTypeEnum.PRODUCER
    })

    const forUsersId = forCompanyUsers.map((item) => String(item.user))

    let company
    const query = {
      'types.0': companyType?._id,
      collaborators: {
        $elemMatch: {
          user: { $in: forUsersId },
          role: null
        }
      }
    }

    const countCompanies = await CompanyRepository.count(query)
    const cursor = await CompanyRepository.findByCursor(query)

    while ((company = await cursor.next())) {
      i = this.processingProgressBar(i, countCompanies)
      console.log('\n')
      await StorageService.add(company, this.nameFileBackup)
      let { _id: companyId, collaborators = [] } = company
      for (const forUser of forUsersId) {
        const forCollaborator = collaborators.find(
          (collaborator) =>
            String(collaborator.user) === String(forUser) &&
            String(collaborator.company) === String(forCompany._id)
        )

        const fromCollaborator = collaborators.find(
          (collaborator) =>
            String(collaborator.user) === String(forUser) &&
            String(collaborator.company) === String(fromCompany?._id)
        )

        if (forCollaborator) {
          await CompanyRepository.updateOne(
            { 'collaborators._id': forCollaborator._id },
            {
              $set: {
                'collaborators.$.role': adviserRole._id,
                'collaborators.$.identifier': forCompany.identifier
              }
            }
          )
          if (fromCollaborator) {
            await CompanyRepository.updateOne(
              { _id: companyId },
              {
                $pull: { collaborators: { _id: fromCollaborator._id } }
              }
            )
          }
        } else {
          if (fromCollaborator) {
            await CompanyRepository.updateOne(
              { 'collaborators._id': fromCollaborator._id },
              {
                $set: {
                  'collaborators.$.role': adviserRole._id,
                  'collaborators.$.company': forCompany._id,
                  'collaborators.$.identifier': forCompany.identifier,
                  'collaborators.$.isAdmin': Boolean(fromCollaborator.isAdmin),
                  'collaborators.$.isResponsible': Boolean(
                    fromCollaborator.isResponsible
                  )
                }
              }
            )
          }
        }
      }
    }
  }
}
