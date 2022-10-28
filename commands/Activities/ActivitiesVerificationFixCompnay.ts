import { BaseCommand, flags } from '@adonisjs/core/build/standalone'
import ActivityRepository from 'App/Core/Activity/Infrastructure/Mongoose/Repositories'
import CompanyRepository from 'App/Core/Company/Infrastructure/Mongoose/Repositories'
import StorageService from 'App/Core/Storage/Services/StorageService'
import CropRepository from 'App/Core/Crop/Infrastructure/Mongoose/Repositories'

export default class ActivitiesVerificationFixCompany extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'activities:verification:fix:company'

  /**
   * Command description is displayed in the "help" output
   */
  public static description =
    'This command corrects the company of the verifier activities'
  @flags.boolean({ alias: 'r', description: 'Rollback flag' })
  public rollbackCommand: boolean

  private verificationCompanyIdentifier = '30608663815'
  private nameFileBackup: string = 'activities-verification-fix-company.json'

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
    this.logger.success('Started Update Company in activities of Verification')
    try {
      if (this.rollbackCommand) {
        this.logger.success(
          'Started rollback Update Company in activities of Verification'
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
    this.logger.success('Update Company in activities of Verification Success')
  }

  public async execute(): Promise<void> {
    let i: number = 0
    const company = await CompanyRepository.findOne({
      identifier: this.verificationCompanyIdentifier
    })

    if (!company) {
      this.logger.info(
        `The company with identifier: ${this.verificationCompanyIdentifier} dont exist`
      )
      this.exit()
    }

    const fileExists = await StorageService.fileExists(this.nameFileBackup)
    if (!fileExists) {
      await StorageService.create([], this.nameFileBackup)
    }

    let activity
    const query = {
      company: company._id,
      crop: { $ne: null },
      verificationType: { $ne: null }
    }
    const countActivities = await ActivityRepository.count(query)
    const cursor = await ActivityRepository.findByCursor(query)
    while ((activity = await cursor.next())) {
      i = this.processingProgressBar(i, countActivities)
      const crop = await CropRepository.findOne({ _id: activity.crop })
      let companyInCrop
      if (!companyInCrop) {
        companyInCrop = await CompanyRepository.findOne({
          identifier: crop?.identifier
        })
      }
      await StorageService.add(
        {
          activityId: activity._id,
          toSetData: {
            company: activity.company
          }
        },
        this.nameFileBackup
      )
      await ActivityRepository.update(
        { _id: activity._id },
        {
          $set: {
            company: crop?.company ?? companyInCrop?._id ?? activity.company
          }
        }
      )
    }
  }

  /**
   * Rollback Command
   */
  public async rollback(): Promise<void> {
    let i: number = 0
    let data = await StorageService.get(this.nameFileBackup)
    for (const activity of data) {
      await ActivityRepository.findOneAndUpdate(
        {
          _id: activity.activityId
        },
        { $set: activity.toSetData }
      )
      i = this.processingProgressBar(i, data.length)
    }

    await StorageService.delete(this.nameFileBackup)
  }
}
