import { BaseCommand, flags } from '@adonisjs/core/build/standalone'
import AchievementRepository from 'App/Core/Achievement/Infrastructure/Mongoose/Repositories'
import ActivityRepository from 'App/Core/Activity/Infrastructure/Mongoose/Repositories'
import CompanyRepository from 'App/Core/Company/Infrastructure/Mongoose/Repositories'
import CropRepository from 'App/Core/Crop/Infrastructure/Mongoose/Repositories'
import StorageRepository from 'App/Core/Storage'

export default class ActivityAddCompanyCrop extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'activity:add:company:crop'

  /**
   * Command description is displayed in the "help" output
   */
  public static description =
    'This command is used for update farms legacies on all cases'

  @flags.boolean({ alias: 'r', description: 'Rollback flag' })
  public rollbackCommand: boolean

  private nameFileBackupActivity: string = 'update-activity-legacy.json'

  private nameFileBackupAchievement: string = 'update-achievement-legacy.json'

  private nameFileCompanyNotFound: string = 'company-not-found-activity.json'
  private nameFileCompanyNotFoundAchievement: string =
    'company-not-found-achievement.json'

  private companyNotFound: Array<any> = []

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
   * Execute Command
   */
  public async execute(): Promise<void> {
    this.logger.info('Start Process Update Activity')
    let index = 0
    const activities: any = await ActivityRepository.findAll({})
    await StorageRepository.create(
      {
        activities
      },
      this.nameFileBackupActivity
    )
    try {
      const cursor = await CropRepository.findByCursor({})
      const countCrop: number = await CropRepository.count({})
      let crop
      while ((crop = await cursor.next())) {
        const { pending, toMake, done, finished } = crop
        const activities = [...pending, ...toMake, ...done, ...finished]

        for (const activity of activities) {
          await this.updateActivity(activity, crop)
        }
        index = this.processingProgressBar(index, countCrop)
      }

      const companyNotFoundContent = this.companyNotFound
      await StorageRepository.create(
        {
          companyNotFoundContent
        },
        this.nameFileCompanyNotFound
      )
      this.logger.info(`Finish update activity add id company and id crop`)
    } catch (error) {
      this.logger.error(`Error: ${error}`)
    }
  }

  public async executeUpdateAchievement(): Promise<void> {
    this.logger.info('Start Process Update Achievement')
    let index = 0
    const achievements: any = await AchievementRepository.findAll({})
    await StorageRepository.create(
      {
        achievements
      },
      this.nameFileBackupAchievement
    )

    try {
      let companyNotFound: Array<any> = []
      const cursor: any = await ActivityRepository.findByCursor({})
      const countActivities: number = await ActivityRepository.count({})
      let activity
      while ((activity = await cursor.next())) {
        if (activity.achievements) {
          for (const achievement of activity.achievements) {
            if (activity.company && activity.crop) {
              await AchievementRepository.findOneAndUpdate(
                {
                  _id: achievement._id
                },
                {
                  $set: {
                    company: activity.company,
                    crop: activity.crop,
                    activity: activity._id
                  }
                }
              )
            } else {
              companyNotFound.push({
                achievementId: achievement._id,
                activityId: activity._id
              })
            }
          }
        }
        index = this.processingProgressBar(index, countActivities)
      }

      await StorageRepository.create(
        {
          companyNotFound
        },
        this.nameFileCompanyNotFoundAchievement
      )

      this.logger.info(
        `Finish update achievement add id company, id crop and id activity`
      )
    } catch (error) {
      this.logger.error(`Error: ${error}`)
    }
  }

  private async updateActivity(activityId: any, crop: any) {
    const companyId = !crop.company
      ? (await CompanyRepository.findOne({ identifier: crop.identifier }))?._id
      : crop.company
    if (companyId) {
      await ActivityRepository.findOneAndUpdate(
        {
          _id: activityId
        },
        { $set: { company: companyId, crop: crop._id } }
      )
    } else {
      this.companyNotFound.push({
        cropId: crop._id.toString(),
        companyIdentifier: crop.identifier,
        activityId: await (
          await ActivityRepository.findOnePopulate({ _id: activityId })
        )._id.toString()
      })
    }
  }

  /**
   * Rollback Command
   */
  public async rollback(): Promise<void> {
    this.logger.info('Start Process Rollback Activity')
    let i: number = 0

    const dataAct = await StorageRepository.get(this.nameFileBackupActivity)

    for (const activity of dataAct.activities) {
      await ActivityRepository.replaceOne(
        {
          _id: activity._id
        },
        {
          ...activity
        }
      )

      i = this.processingProgressBar(i, dataAct.activities.length)
    }

    this.logger.info('Start Process Rollback Achievement')
    i = 0
    const dataAch = await StorageRepository.get(this.nameFileBackupAchievement)

    for (const achievement of dataAch.achievements) {
      await AchievementRepository.replaceOne(
        {
          _id: achievement._id
        },
        {
          ...achievement
        }
      )
      i = this.processingProgressBar(i, dataAch.achievements.length)
    }

    await StorageRepository.delete(this.nameFileBackupAchievement)
    await StorageRepository.delete(this.nameFileBackupActivity)
  }

  public async run() {
    try {
      if (this.rollbackCommand) {
        await this.rollback()
      } else {
        await this.execute()
        await this.executeUpdateAchievement()
      }
    } catch (error) {
      this.logger.error(`Error Message: ${error.message}`)
      this.logger.error(`Error: ${error}`)
    }

    this.logger.logUpdatePersist()
    this.logger.success('done')
  }
}
