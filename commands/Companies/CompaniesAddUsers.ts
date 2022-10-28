import { BaseCommand, flags } from '@adonisjs/core/build/standalone'
import { companiesProducersV2 } from '../../dataset/resources/update_user_kam_in_crop/companies-producers-and-users-ucropit_v2.json'
import CompanyRepository from 'App/Core/Company/Infrastructure/Mongoose/Repositories'
import UserRepository from 'App/Core/User/Infrastructure/Mongoose/Repositories'
import StorageService from 'App/Core/Storage/Services/StorageService'
import RolRepository from 'App/Core/Rol/Infrastructure/Mongoose/Repositories'
import { ERoles } from 'App/Core/Rol/Infrastructure/Interfaces'
import AwsS3Service from 'App/Core/Storage/Services/AwsS3Service'
import { CompanyTypeEnum } from 'App/Core/CompanyType/Infrastructure/enums/CompanyType.enum'
import { inspect } from 'util'

export default class CompaniesAddUsers extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'companies:add:users'

  /**
   * Command description is displayed in the "help" output
   */
  public static description = ''

  private nameFileBackup: string = 'companies-add-users-with-roles.json'

  @flags.boolean({ alias: 'r', description: 'Rollback flag' })
  public rollbackCommand: boolean

  private ucropitCompanyIdentifier = '30716983702'
  private garamendyCompanyIdentifier = '801174732'
  private garamendyUsers = [
    'almudena@ucrop.it',
    'liz@ucrop.it',
    'federicod@ucrop.it'
  ]

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

  public async run() {
    this.logger.info('Started adding users in companies.')
    try {
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

      const selectedUserEmail = await this.prompt.choice(
        'Select the user to add companies to advice',
        this.getEmails()
      )

      if (selectedUserEmail === 'NONE') {
        this.exit()
      }
      const user = await UserRepository.findOne({
        email: selectedUserEmail
      })

      if (!user) {
        this.logger.info(
          `The user with email <${selectedUserEmail}>is not registered in the database`
        )
        this.exit()
      }

      let data = await StorageService.get(this.nameFileBackup)
      const companies = data[user._id].companies
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

  public getEmails(): string[] {
    const usersEmail = companiesProducersV2
      .map((item) => item.email.trim())
      .reduce(
        (prevList, current) =>
          // @ts-ignore
          prevList.includes(current) ? prevList : [...prevList, current],
        []
      )
      .sort()
    usersEmail.push('NONE')
    return usersEmail
  }

  public async execute(): Promise<void> {
    let i: number = 0
    const currentDate = new Date()

    const selectedUserEmail = await this.prompt.choice(
      'Select the user to add companies to advice',
      this.getEmails()
    )

    if (selectedUserEmail === 'NONE') {
      await this.exit()
    }

    const user = await UserRepository.findOne({
      email: selectedUserEmail
    })

    if (!user) {
      this.logger.info(
        `The user with email <${selectedUserEmail}>is not registered in the database`
      )
      await this.exit()
    }

    const companiesProducersList = companiesProducersV2 as any[]
    const identifier = this.garamendyUsers.includes(selectedUserEmail)
      ? this.garamendyCompanyIdentifier
      : this.ucropitCompanyIdentifier

    const ucropitCompany = await CompanyRepository.findOne({
      identifier
    })

    if (!ucropitCompany) {
      this.logger.info(
        `The ucropit company identifier: ${identifier} dont exist`
      )
      await this.exit()
    }

    const adviserRole = await RolRepository.findOne({ value: ERoles.ADVISER })

    if (!adviserRole) {
      this.logger.info('The adviser role is not registered in the database')
      await this.exit()
    }

    const { users: companyUsers = [] } = ucropitCompany

    // verificar si el usuario pertenece a la empresa ucropit
    const userAlreadyBelongToCompany = companyUsers?.find(
      (collaborator) => String(collaborator.user) === String(user._id)
    )

    if (userAlreadyBelongToCompany) {
      await CompanyRepository.findOneAndUpdate(
        { 'users._id': userAlreadyBelongToCompany._id },
        {
          $set: {
            'users.$.role': adviserRole._id,
            'users.$.isResponsible': true
          }
        }
      )
    } else {
      const userToAdd = {
        isAdmin: false,
        isResponsible: true,
        user: user._id,
        role: adviserRole._id,
        company: ucropitCompany._id
      }
      await CompanyRepository.findOneAndUpdate(
        { _id: ucropitCompany._id },
        {
          $push: { users: userToAdd },
          $pull: { collaborators: { user: user._id } }
        }
      )
    }

    await this.updateRelationshipWithCompany(user, ucropitCompany)

    const fileExists = await StorageService.fileExists(this.nameFileBackup)
    if (!fileExists) {
      await StorageService.create(
        {
          [user._id]: {
            companies: []
          }
        },
        this.nameFileBackup
      )
    }

    const companies = companiesProducersList.filter(
      (companyProducer) => companyProducer.email.trim() === selectedUserEmail
    )
    const companiesToRollback: any[] = []
    const companiesWithError: any[] = []
    for (const companyProducer of companies) {
      i = this.processingProgressBar(i, companies.length)
      const companyDoc = await CompanyRepository.findOne(
        {
          _id: companyProducer.company
        },
        ['types']
      )

      if (!companyDoc) {
        companiesWithError.push({
          // @ts-ignore
          company: companyProducer.company,
          // @ts-ignore
          message: 'company not exits'
        })
        continue
      }

      // @ts-ignore
      if (companyDoc?.types[0]?.name !== CompanyTypeEnum.PRODUCER) {
        companiesWithError.push({
          // @ts-ignore
          company: companyProducer.company,
          // @ts-ignore
          message: `company is not <${CompanyTypeEnum.PRODUCER}>`
        })
        continue
      }

      companiesToRollback.push(companyDoc)
      await StorageService.add(
        {
          [user._id]: {
            companies: companiesToRollback
          }
        },
        this.nameFileBackup
      )

      const userExits = (companyDoc.users ?? []).find(
        (item) => String(item?.user) === String(user._id)
      )
      if (userExits) {
        companiesWithError.push({
          // @ts-ignore
          identifier: companyProducer.TaxID,
          // @ts-ignore
          user: user._id,
          // @ts-ignore
          inArray: 'users',
          // @ts-ignore
          role: userExits?.role,
          // @ts-ignore
          message: 'user Exits in array users'
        })
        continue
      }
      const collaboratorExits = (companyDoc.collaborators ?? []).find(
        (item) =>
          String(item?.user) === String(user._id) &&
          String(item?.company) === String(ucropitCompany._id)
      )
      if (collaboratorExits) {
        await CompanyRepository.updateOne(
          {
            _id: companyDoc._id,
            'collaborators._id': collaboratorExits._id
          },
          {
            $set: {
              'collaborators.$.isResponsible': true,
              'collaborators.$.role': adviserRole._id
            }
          }
        )
        continue
      }

      const collaborator = {
        isResponsible: true,
        isAdmin: false,
        user: user._id,
        role: adviserRole._id,
        company: ucropitCompany._id
      }
      await CompanyRepository.updateOne(
        {
          _id: companyDoc._id
        },
        {
          $addToSet: { collaborators: collaborator }
        }
      )
    } //- Fin for
    if (companiesWithError.length) {
      const results = {
        user: selectedUserEmail,
        companiesWithError
      }
      try {
        const response = await AwsS3Service.upload(
          `results-commands/companies-add-users-${currentDate.getTime()}.json`,
          Buffer.from(JSON.stringify(results, null, 2)),
          'application/json',
          '',
          'public-read'
        )
        this.logger.info(
          `companies with error detail url: ${response.Location}`
        )
      } catch (e) {
        console.log(inspect(companiesWithError, { depth: null }))
      }
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
}
