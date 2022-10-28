import { BaseCommand, flags } from '@adonisjs/core/build/standalone'
import { AchievementRepositoryContract } from 'App/Core/Achievement/Infrastructure/Contracts'
import { ActivityRepositoryContract } from 'App/Core/Activity/Infrastructure/Contracts'
import { StorageContract } from 'App/Core/Storage/Contracts'
import Aws from '@ioc:Aws'

export default class DeleteDuplicateSignersActivitiesAchievements extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'delete:duplicate:signers:activities:achievements'

  /**
   * Command description is displayed in the "help" output
   */
  public static description =
    'This command delete duplicate signers in activities and achievements'

  @flags.boolean({ alias: 'r', description: 'Rollback flag' })
  public rollbackCommand: boolean

  private nameFileBackup: string = 'duplicate-signers.json'
  private activityRepo: ActivityRepositoryContract
  private achievementRepo: AchievementRepositoryContract
  private storageRepo: StorageContract
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

  private async setRepositories() {
    const { default: ActivityRepository } = await import(
      '@ioc:Ucropit/Core/ActivityRepository'
    )
    const { default: AchievementRepository } = await import(
      '@ioc:Ucropit/Core/AchievementRepository'
    )
    const { default: StorageRepository } = await import(
      '@ioc:Ucropit/Core/StorageRepository'
    )

    this.activityRepo = ActivityRepository
    this.achievementRepo = AchievementRepository
    this.storageRepo = StorageRepository
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

  public async run() {
    this.logger.success(
      'Started delete duplicate signers in activities and achievements'
    )
    await this.setRepositories()
    try {
      if (this.rollbackCommand) {
        this.logger.success(
          'Started rollback delete duplicate signers in activities and achievements'
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
    this.logger.success(
      'Delete duplicate signers in activities and achievements Success'
    )
  }

  public async execute(): Promise<void> {
    let i: number = 0
    let listBackup: Array<Object> = []
    const bucket = await this.prompt.ask('Enter the bucket', {
      validate: this.validate
    })
    const key = await this.prompt.ask('Enter the key', {
      validate: this.validate
    })

    let data = await this.getFile(bucket, key)
    let signersDeleteDuplicateActivitiesAchievements = JSON.parse(
      data.body.toString('utf-8')
    )

    for (const item of signersDeleteDuplicateActivitiesAchievements) {
      if (item.id_activity) {
        let activity = await this.activityRepo.findOne({
          _id: item.id_activity
        })
        let unique = activity.signers
          .map((signer) => signer.userId.toString())
          .map((userId, i, arrSigners) => arrSigners.indexOf(userId) === i && i)
          .filter((positionSigner) => activity.signers[positionSigner])
          .map((positionSigner) => activity.signers[positionSigner])

        const activityBackup = {
          activityId: item.id_activity,
          signers: activity.signers,
          type: 'activity'
        }
        listBackup.push(activityBackup)
        await this.activityRepo.findOneAndUpdate(
          {
            _id: item.id_activity
          },
          { signers: unique }
        )
        i = this.processingProgressBar(
          i,
          signersDeleteDuplicateActivitiesAchievements.length
        )
      }

      if (item.id_achievement) {
        let achievement = await this.achievementRepo.findOne({
          _id: item.id_achievement
        })
        let unique = achievement.signers
          .map((signer) => signer.userId.toString())
          .map((userId, i, arrSigners) => arrSigners.indexOf(userId) === i && i)
          .filter((positionSigner) => achievement.signers[positionSigner])
          .map((positionSigner) => achievement.signers[positionSigner])

        const achievementBackup = {
          achievementId: item.id_achievement,
          signers: achievement.signers,
          type: 'achievement'
        }
        listBackup.push(achievementBackup)
        await this.achievementRepo.findOneAndUpdate(
          {
            _id: item.id_achievement
          },
          { signers: unique }
        )
        i = this.processingProgressBar(
          i,
          signersDeleteDuplicateActivitiesAchievements.length
        )
      }
    }

    await this.storageRepo.create(listBackup, this.nameFileBackup)
  }
  private async getFile(bucket: string, key: string): Promise<any> {
    this.logger.await('Waiting for the data in S3')
    const s3 = new Aws.S3()
    let data = await s3
      .getObject({
        Bucket: bucket,
        Key: key
      })
      .promise()
    return {
      body: data.Body,
      ContentType: data.ContentType
    }
  }

  /**
   * Rollback Command
   */
  public async rollback(): Promise<void> {
    let i: number = 0
    const data = await this.storageRepo.get(this.nameFileBackup)

    for (const item of data) {
      if (item.type === 'activity') {
        await this.activityRepo.findOneAndUpdate(
          {
            _id: item.activityId
          },
          { signers: item.signers }
        )
      }
      if (item.type === 'achievement') {
        await this.achievementRepo.findOneAndUpdate(
          {
            _id: item.achievementId
          },
          { signers: item.signers }
        )
      }

      i = this.processingProgressBar(i, data.length)
    }

    await this.storageRepo.delete(this.nameFileBackup)
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
}
