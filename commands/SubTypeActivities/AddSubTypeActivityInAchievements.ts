import { BaseCommand, flags } from '@adonisjs/core/build/standalone'
import { StorageContract } from 'App/Core/Storage/Contracts'
import { AchievementRepositoryContract } from 'App/Core/Achievement/Infrastructure/Contracts'
import { ActivityRepositoryContract } from 'App/Core/Activity/Infrastructure/Contracts'
import {
  activitiesWithSubTypeActivityPipelines,
  countActivitiesWithSubTypeActivityPipelines
} from 'App/Core/Activity/Infrastructure/Mongoose/PipeLines'
import { IS_CURSOR, ZERO_RESULT } from 'App/utils'

export default class AddSubTypeActivityInAchievements extends BaseCommand {
  /**
   * ActivityRepository
   */
  private activityRepository: ActivityRepositoryContract
  /**
   * AchievementRepository
   */
  private achievementRepository: AchievementRepositoryContract

  /**
   * StorageRepository
   */
  private storageRepository: StorageContract
  /**
   * Command name is used to run the command
   */
  public static commandName = 'add:subTypeActivity:in:achievement'

  /**
   * Command description is displayed in the "help" output
   */
  public static description =
    "this command adds the subTypeActivity of an activity in realizations that don't have it"

  @flags.boolean({ alias: 'r', description: 'Rollback flag' })
  public rollbackCommand: boolean

  private nameFileBackup: string = 'add-subTypeActivity-in-achievement.json'

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
   * @param limit index
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

  /**
   * Set Repositories to use command.
   */
  private async setRepositories(): Promise<void> {
    const { default: ActivityRepository } = await import(
      '@ioc:Ucropit/Core/ActivityRepository'
    )
    const { default: AchievementRepository } = await import(
      '@ioc:Ucropit/Core/AchievementRepository'
    )
    const { default: StorageRepository } = await import(
      '@ioc:Ucropit/Core/StorageRepository'
    )

    this.activityRepository = ActivityRepository
    this.achievementRepository = AchievementRepository
    this.storageRepository = StorageRepository
  }

  /**
   * Execute method command.
   */
  private async execute(): Promise<void> {
    let activity
    let i = 0
    let listAchievementBackup: Array<Object> = []
    const results = await this.activityRepository.aggregate(
      countActivitiesWithSubTypeActivityPipelines
    )
    const count = results[0]?.totals ?? ZERO_RESULT
    const cursor = await this.activityRepository.aggregate(
      activitiesWithSubTypeActivityPipelines,
      IS_CURSOR
    )
    while ((activity = await cursor.next())) {
      const { subTypeActivity, achievements } = activity
      const setData = {
        subTypeActivity: subTypeActivity._id,
        keySubTypesActivity: subTypeActivity.keySubTypesActivity
      }
      const achievementBackup = {
        achievements
      }
      listAchievementBackup.push(achievementBackup)
      await this.achievementRepository.updateMany(
        { _id: { $in: achievements } },
        { $set: setData }
      )
      i = this.processingProgressBar(i, count)
    }
    await this.storageRepository.create(
      listAchievementBackup,
      this.nameFileBackup
    )
  }

  /**
   * Rollback command
   */
  private async rollback(): Promise<void> {
    let i = 0
    const data = await this.storageRepository.get(this.nameFileBackup)
    for (const item of data) {
      const setData = {
        subTypeActivity: null,
        keySubTypesActivity: null
      }
      await this.achievementRepository.updateMany(
        { _id: { $in: item.achievements } },
        { $set: setData }
      )
      i = this.processingProgressBar(i, data.length)
    }
    await this.storageRepository.delete(this.nameFileBackup)
  }

  /**
   * Run command.
   */
  public async run() {
    await this.setRepositories()
    this.logger.success('Started Add SubTypeActivity In Achievement')
    try {
      if (this.rollbackCommand) {
        await this.rollback()
      } else {
        await this.execute()
      }
    } catch (error) {
      this.logger.error(`Error Message: ${error.message}`)
      this.logger.error(`Error: ${error}`)
    }
    this.logger.logUpdatePersist()
    this.logger.success('Add SubTypeActivity In Achievement')
  }
}
