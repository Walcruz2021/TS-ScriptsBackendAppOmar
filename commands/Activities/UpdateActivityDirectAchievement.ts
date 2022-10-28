import { BaseCommand, flags } from '@adonisjs/core/build/standalone'
import ActivityRepository from 'App/Core/Activity/Infrastructure/Mongoose/Repositories'
import StorageRepository from 'App/Core/Storage'

export default class UpdateActivityDirectAchievement extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'update:activity:direct:achievement'

  /**
   * Command description is displayed in the "help" output
   */
  public static description =
    'This command is used for update activities replacing surfacePlaning with surfaceRealized'

  @flags.boolean({ alias: 'r', description: 'Rollback flag' })
  public rollbackCommand: boolean

  private nameFileBackupActivity: string =
    'update-activity-direct-achievement-legacy.json'

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
    const query = {
      isDirectAchievement: true
    }

    let activities: any = await ActivityRepository.findAll(query)

    await StorageRepository.create(
      {
        activities
      },
      this.nameFileBackupActivity
    )
    try {
      const cursor = await ActivityRepository.findByCursor(query)
      const countActivity: number = await ActivityRepository.count(query)
      let activity
      while ((activity = await cursor.next())) {
        activity.lotsWithSurface = activity.lotsWithSurface.map((lot) => {
          let lotsWithSurfaceRealized = {
            surfaceRealized: lot.surfacePlanned,
            ...lot._doc
          }
          delete lotsWithSurfaceRealized.surfacePlanned
          return lotsWithSurfaceRealized
        })

        await ActivityRepository.findOneAndUpdate(
          {
            _id: activity._id
          },
          {
            ...activity
          }
        )
        index = this.processingProgressBar(index, countActivity)
      }

      this.logger.info(
        `Finish update activity replacing surfacePlaning with surfaceRealized`
      )
    } catch (error) {
      this.logger.error(`Error: ${error}`)
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
  }

  public async run() {
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
    this.logger.success('done')
  }
}
