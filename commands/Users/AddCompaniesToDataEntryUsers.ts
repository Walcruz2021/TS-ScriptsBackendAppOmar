import { BaseCommand, flags } from '@adonisjs/core/build/standalone'
import RolRepository from 'App/Core/Rol/Infrastructure/Mongoose/Repositories'
import CompanyRepository from 'App/Core/Company/Infrastructure/Mongoose/Repositories'
import CompanyTypeRepository from 'App/Core/CompanyType/Infrastructure/Mongoose/Repositories'
import { ERoles } from 'App/Core/Rol/Infrastructure/Interfaces'
import StorageService from '../../app/Core/Storage/Services/StorageService'
import { existsSync } from 'fs'
import AwsS3Service from '../../app/Core/Storage/Services/AwsS3Service'
import { inspect } from 'util'
import { CompanyTypeEnum } from 'App/Core/CompanyType/Infrastructure/enums/CompanyType.enum'
import UserRepository from 'App/Core/User/Infrastructure/Mongoose/Repositories'

export default class AddCompaniesToDataEntryUsers extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'add:companies:to:dataentries:users'

  /**
   * Command description is displayed in the "help" output
   */
  public static description =
    'Use this command to add companies to advise on dataentry users'

  private nameFileBackup: string = 'dataentry-users-companies.json'

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

  private ucropitCompanyIdentifier = '30716983702'

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
   * @param number index
   *
   * @returns
   */
  private processingProgressBar(index: number, limit: number): number {
    if (index < limit) {
      index++
      this.logger.logUpdate(
        `Processing: ${this.getProgressBar(
          Math.trunc((index * 100) / limit)
        )} ${Math.trunc((index * 100) / limit)}%`
      )
    }
    return index
  }

  public async rollback(): Promise<void> {
    const ucropitCompany = await CompanyRepository.findOne(
      {
        identifier: this.ucropitCompanyIdentifier,
        isDataEntryTrue: true
      },
      {
        path: 'users.user'
      }
    )
    const users = ucropitCompany
      .users!.filter((users) => users.isDataEntry)
      .map((users) => users.user.email)
    const selectedUserEmail = await this.prompt.choice(
      'Select the user to rollback companies',
      users
    )

    if (selectedUserEmail === 'NONE') {
      this.exit()
    }
    const user = await UserRepository.findOne({ email: selectedUserEmail })

    if (!user) {
      this.logger.info('The user is not registered in the database')
      this.exit()
    }

    if (!ucropitCompany) {
      this.logger.info(
        `The ucropit company identifier: ${this.ucropitCompanyIdentifier} dont exist`
      )
      this.exit()
    }

    const companies = await StorageService.get(this.nameFileBackup)
    if (!companies && !companies.length) {
      this.logger.error(`Error: The rollBack data does not exist`)
      this.exit()
    }

    for (const company of companies) {
      await CompanyRepository.findOneAndUpdate(
        { _id: company._id },
        { $pull: { collaborators: { user: user._id } } }
      )
    }

    await CompanyRepository.findOneAndUpdate(
      { _id: ucropitCompany._id },
      { $pull: { users: { user: user._id } } }
    )
  }

  public async execute(): Promise<void> {
    let index = 0
    const currentDate = new Date()

    const adviserRole = await RolRepository.findOne({ value: ERoles.ADVISER })
    const companyType = await CompanyTypeRepository.findOne({
      name: CompanyTypeEnum.PRODUCER
    })
    const ucropitCompany = await CompanyRepository.findOne(
      {
        identifier: this.ucropitCompanyIdentifier,
        isDataEntryTrue: true
      },
      {
        path: 'users.user'
      }
    )

    const users = ucropitCompany
      .users!.filter((users) => users.isDataEntry)
      .map((users) => users.user.email)

    const selectedUserEmail = await this.prompt.choice(
      'Select the user to add companies to advice',
      users
    )

    if (selectedUserEmail === 'NONE') {
      this.exit()
    }
    const user = await UserRepository.findOne({ email: selectedUserEmail })
    if (!user) {
      this.logger.info('The user is not registered in the database')
      this.exit()
    }

    if (!adviserRole) {
      this.logger.info('The adviser role is not registered in the database')
      this.exit()
    }

    if (!ucropitCompany) {
      this.logger.info(
        `The ucropit company identifier: ${this.ucropitCompanyIdentifier} dont exist`
      )
      this.exit()
    }

    const companies = await CompanyRepository.findAll({
      'types.0': companyType._id
    })

    if (!companies.length) {
      this.logger.info('There are not companies to add for data entry users')
      this.exit()
    }

    const hasRollbackData = existsSync(this.nameFileBackup)
    if (!hasRollbackData) {
      await StorageService.create([], this.nameFileBackup)
    }
    let companiesUpdated = 0
    const companiesWithError: any[] = []

    const { users: companyUsers = [] } = ucropitCompany

    // verificar si el usuario pertenece a la empresa ucropit
    const userAlreadyBelongToCompany = companyUsers?.find(
      (collaborator) => String(collaborator.user) === String(user._id)
    )

    if (userAlreadyBelongToCompany) {
      await CompanyRepository.findOneAndUpdate(
        { 'users._id': userAlreadyBelongToCompany._id },
        { $set: { 'users.$.role': adviserRole._id } }
      )
    } else {
      const userToAdd = {
        isAdmin: false,
        isResponsible: false,
        user: user._id,
        role: adviserRole._id,
        company: ucropitCompany._id,
        identifier: ucropitCompany.identifier
      }
      await CompanyRepository.findOneAndUpdate(
        { _id: ucropitCompany._id },
        {
          $push: { users: userToAdd },
          $pull: { collaborators: { user: user._id } }
        }
      )
    }

    for (const companyInDb of companies) {
      index = this.processingProgressBar(index, companies.length)
      const { collaborators = [] } = companyInDb

      // verificar si el usuario esta como collaborador en la productora
      const userAlreadyCollaborating = collaborators.find(
        (collaborator) => String(collaborator.user) === String(user._id)
      )

      if (userAlreadyCollaborating) {
        await CompanyRepository.findOneAndUpdate(
          { 'collaborators._id': userAlreadyCollaborating._id },
          { $set: { 'collaborators.$.role': adviserRole._id } }
        )
        companiesUpdated++
      } else {
        const userToAdd = {
          isAdmin: false,
          isResponsible: false,
          user: user._id,
          role: adviserRole._id,
          company: ucropitCompany._id,
          identifier: ucropitCompany.identifier
        }
        await StorageService.add(companyInDb, this.nameFileBackup)
        await CompanyRepository.findOneAndUpdate(
          { _id: companyInDb._id },
          { $push: { collaborators: userToAdd } }
        )
        companiesUpdated++
      }
    }

    this.logger.info(`companies updated: ${companiesUpdated}`)
    if (companiesWithError.length) {
      const results = {
        user: user.email,
        companiesWithError
      }
      try {
        const response = await AwsS3Service.upload(
          `results-commands/${currentDate.getTime()}.json`,
          Buffer.from(JSON.stringify(results, null, 2)),
          'application/json',
          '',
          'public-read'
        )
        this.logger.info(
          `companies with error detail url: ${response.Location}`
        )
      } catch (err) {
        console.log(inspect(companiesWithError, { depth: null }))
      }
    }
  }

  public async run() {
    this.logger.success('Started add companies to dataentry users')
    try {
      if (this.rollbackCommand) {
        this.logger.success('Started rollback for dataenry users')
        await this.rollback()
      } else {
        await this.execute()
      }
    } catch (error) {
      this.logger.error(`Error Message: ${error.message}`)
      this.logger.error(`Error: ${error}`)
    }
    this.logger.logUpdatePersist()
    this.logger.success('Finish added companies to dataentry users')
  }
}
