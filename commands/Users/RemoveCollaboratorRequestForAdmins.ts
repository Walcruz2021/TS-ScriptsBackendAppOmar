import { BaseCommand, flags } from '@adonisjs/core/build/standalone'
import StorageService from 'App/Core/Storage/Services/StorageService'
import UserRepository from 'App/Core/User/Infrastructure/Mongoose/Repositories'
import CompanyRepository from 'App/Core/Company/Infrastructure/Mongoose/Repositories'
import CollaboratorRequestRepository from 'App/Core/CollaboratorRequests/Infrastructures/Mongoose/Repositories'
import { StateCollaboratorRequestTypes } from '../../app/Core/CollaboratorRequests/Infrastructures/Mongoose/Enums/CollaboratorRequest.enum'

export default class RemoveCollaboratorRequestForAdmins extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'remove:collaboratorRequest:for:admins'

  /**
   * Command description is displayed in the "help" output
   */
  public static description =
    'This command will remove collaborator request if the user is a company Admin'

  @flags.boolean({ alias: 'r', description: 'Rollback flag' })
  public rollbackCommand: boolean

  private nameFileBackup: string =
    'remove-collaborator-request-for-admins-users.json'
  private nameFileBackupUsers: string =
    'remove-collaborator-request-for-admins.json'

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

  /**
   * @function validate
   * @description Validate if data is not empty
   * @param data
   * @return String || Boolean
   * */

  private async validate(data: string): Promise<string | boolean> {
    if (!data) {
      return 'Can not be empty'
    }
    return true
  }

  public async rollback(): Promise<void> {
    let i: number = 0
    const user = await StorageService.get(this.nameFileBackupUsers)
    const collaboratorRequests = await StorageService.get(this.nameFileBackup)

    const { userId, collaboratorRequest } = user

    await UserRepository.findOneAndUpdate(
      {
        _id: userId
      },
      {
        $set: { collaboratorRequest }
      }
    )

    for (const cRequest of collaboratorRequests) {
      i = this.processingProgressBar(i, collaboratorRequests.length)
      await CollaboratorRequestRepository.create({
        ...cRequest
      })
    }
  }

  public async execute(): Promise<void> {
    const userEmail = await this.prompt.ask('Enter the email of the user', {
      validate: this.validate
    })
    const companyIdentifier = await this.prompt.ask(
      'Enter the company identifier',
      {
        validate: this.validate
      }
    )

    const user = await UserRepository.findOne({ email: userEmail })

    const company = await CompanyRepository.findOne(
      {
        identifier: companyIdentifier
      },
      {
        path: 'users.user'
      }
    )

    if (!user) {
      this.logger.info('The user is not registered in the database')
      this.exit()
    }

    if (!company) {
      this.logger.info(
        `The company identifier: ${companyIdentifier} dont exist`
      )
      this.exit()
    }

    const isCompanyAdmin = user.companies.some(
      (company) => company.identifier === companyIdentifier && company.isAdmin
    )

    if (isCompanyAdmin) {
      const pendingOrRejectedCRequests =
        await CollaboratorRequestRepository.findAll({
          user: user._id,
          company: company._id,
          $or: [
            { status: StateCollaboratorRequestTypes.pending },
            { status: StateCollaboratorRequestTypes.rejected }
          ]
        })

      if (!pendingOrRejectedCRequests.length) {
        this.logger.info(
          'The user dont have pending or rejected collaborator request'
        )
        this.exit()
      }

      const backupUser = {
        userId: user._id,
        collaboratorRequest: user.collaboratorRequest
      }

      await StorageService.create(backupUser, this.nameFileBackupUsers)

      await StorageService.create(
        pendingOrRejectedCRequests,
        this.nameFileBackup
      )

      const userCRequestToUpdate = user.collaboratorRequest.filter(
        (cRequest) =>
          !pendingOrRejectedCRequests.some(
            (pendingOrRejectedCRequest) =>
              String(pendingOrRejectedCRequest._id) === String(cRequest)
          )
      )

      await UserRepository.findOneAndUpdate(
        { _id: user._id },
        {
          $set: { collaboratorRequest: userCRequestToUpdate }
        }
      )

      await CollaboratorRequestRepository.deleteMany({
        _id: { $in: pendingOrRejectedCRequests.map((crquest) => crquest._id) }
      })
    } else {
      this.logger.info(`This user: ${userEmail} is not admin of the company`)
      this.exit()
    }
  }

  public async run() {
    this.logger.success(
      'Started remove collaborator request for company admins'
    )
    try {
      if (this.rollbackCommand) {
        this.logger.success('Started rollback for company admins')
        await this.rollback()
      } else {
        await this.execute()
      }
    } catch (error) {
      console.log(error)
      this.logger.error(`Error Message: ${error.message}`)
      this.logger.error(`Error: ${error}`)
    }
    this.logger.logUpdatePersist()
    this.logger.success('Finish remove collaborator request for company admins')
  }
}
