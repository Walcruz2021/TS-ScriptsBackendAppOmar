import { BaseCommand, flags } from '@adonisjs/core/build/standalone'
import StorageRepository from 'App/Core/Storage'
import UserRepository from 'App/Core/User/Infrastructure/Mongoose/Repositories'
import CropRepository from 'App/Core/Crop/Infrastructure/Mongoose/Repositories'
import { findRelationshipUserCompanyInCropsPipelines } from 'App/Core/Crop/utils'
import StorageService from 'App/Core/Storage/Services/StorageService'
export default class UserUpdateRelationshipsWithCompaniesFromCrops extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName =
    'user:update:relationships:with:companies:from:crops'

  /**
   * Command description is displayed in the "help" output
   */
  public static description = 'This command update user with companies of crops'

  @flags.boolean({ alias: 'r', description: 'Rollback flag' })
  public rollbackCommand: boolean

  private nameFileBackup: string =
    'user-update-relationships-with-companies-from-crops.json'

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
    this.logger.success('Started update user with companies of crops')
    try {
      if (this.rollbackCommand) {
        this.logger.success(
          'Started rollback update user with companies of crops'
        )
        await this.rollback()
      } else {
        await this.execute()
      }
    } catch (error) {
      this.logger.error(`Error Message: ${error.message}`)
      this.logger.error(`Error: ${error}`)
    }
    this.logger.logUpdatePersist()
    this.logger.success('Update user with companies of crops Success')
  }

  public async execute(): Promise<void> {
    let i: number = 0

    const users = await UserRepository.findAll({})

    // const fileExists = StorageService.fileExists(this.nameFileBackup)
    // if (!fileExists) {
    //   await StorageService.create([], this.nameFileBackup)
    // }
    await StorageService.create([], this.nameFileBackup)
    for (const user of users) {
      i = this.processingProgressBar(i, users.length)
      const { _id: userId, companies } = user
      const crops = await CropRepository.findWithAggregation(
        findRelationshipUserCompanyInCropsPipelines(user._id)
      )
      if (!crops.length) {
        continue
      }
      await StorageService.add(user, this.nameFileBackup)
      const companiesInCrop = crops.flatMap((item) => item?.company)
      companiesInCrop.forEach(({ _id: company, identifier }) => {
        const index = companies.findIndex(
          (item) =>
            String(item.company) === String(company) ||
            item.identifier === identifier
        )
        if (index !== -1) {
          companies[index].company = company
          companies[index].identifier = identifier
        } else {
          companies.push({
            company,
            identifier,
            isAdmin: false
          })
        }
      })
      await UserRepository.update({ _id: userId }, { $set: { companies } })
    }
  }

  /**
   * Rollback Command
   */
  public async rollback(): Promise<void> {
    let i: number = 0
    const users = await StorageRepository.get(this.nameFileBackup)

    for (const user of users) {
      await UserRepository.replaceOne(
        {
          _id: user._id
        },
        { ...user }
      )

      i = this.processingProgressBar(i, users.length)
    }
    await StorageRepository.delete(this.nameFileBackup)
  }
}
