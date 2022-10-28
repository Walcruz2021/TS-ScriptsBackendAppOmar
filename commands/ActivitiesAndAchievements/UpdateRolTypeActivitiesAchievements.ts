import { BaseCommand, flags } from '@adonisjs/core/build/standalone'
import Aws from '@ioc:Aws'
import { AchievementRepositoryContract } from 'App/Core/Achievement/Infrastructure/Contracts'
import { ActivityRepositoryContract } from 'App/Core/Activity/Infrastructure/Contracts'
import { StorageContract } from 'App/Core/Storage/Contracts'

export default class UpdateRolTypeActivitiesAchievements extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'update:roltype:activities:achievements'

  /**
   * Command description is displayed in the "help" output
   */
  public static description =
    'This command update roltype in activities and achievements'

  @flags.boolean({ alias: 'r', description: 'Rollback flag' })
  public rollbackCommand: boolean

  private nameFileBackup: string = 'update.json'
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
    this.logger.success('Started Update Activities and Achievements rol type')
    await this.setRepositories()
    try {
      if (this.rollbackCommand) {
        this.logger.success('Started rollback Update Supply UnitTypes')
        await this.rollback()
      } else {
        await this.execute()
      }
    } catch (error) {
      this.logger.error(`Error Message: ${error.message}`)
      this.logger.error(`Error: ${error}`)
    }
    this.logger.logUpdatePersist()
    this.logger.success('Updated Activities and Achievements rol type')
  }

  public async execute(): Promise<void> {
    const bucket = await this.prompt.ask('Enter the bucket', {
      validate: this.validate
    })
    const key = await this.prompt.ask('Enter the key', {
      validate: this.validate
    })

    let data = await this.getFile(bucket, key)
    let updateTypeRol = JSON.parse(data.body.toString('utf-8'))
    let i: number = 0
    let listBackup: Array<Object> = []

    for (const item of updateTypeRol) {
      if (item.id_activity) {
        const activityBackup = {
          activityId: item.id_activity,
          signerUser: item.id_user,
          type: 'activity'
        }
        listBackup.push(activityBackup)
        await this.activityRepo.findOneAndUpdate(
          {
            _id: item.id_activity,
            'signers.userId': item.id_user
          },
          { $set: { ['signers.$.type']: item.new_role } }
        )
        i = this.processingProgressBar(i, updateTypeRol.length)
      }

      if (item.id_achievement) {
        const achievementBackup = {
          achievementId: item.id_achievement,
          signerUser: item.id_user,
          type: 'achievement'
        }
        listBackup.push(achievementBackup)
        await this.achievementRepo.findOneAndUpdate(
          {
            _id: item.id_achievement,
            'signers.userId': item.id_user
          },
          { $set: { ['signers.$.type']: item.new_role } }
        )
        i = this.processingProgressBar(i, updateTypeRol.length)
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
            _id: item.activityId,
            'signers.userId': item.signerUser
          },
          { $set: { ['signers.$.type']: 'Colaborador' } }
        )
      }
      if (item.type === 'achievement') {
        await this.achievementRepo.findOneAndUpdate(
          {
            _id: item.achievementId,
            'signers.userId': item.signerUser
          },
          { $set: { ['signers.$.type']: 'Colaborador' } }
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
