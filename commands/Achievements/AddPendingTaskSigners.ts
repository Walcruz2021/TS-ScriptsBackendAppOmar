import { BaseCommand, flags } from '@adonisjs/core/build/standalone'
import StorageRepository from 'App/Core/Storage'
import AchievementRepository from 'App/Core/Achievement/Infrastructure/Mongoose/Repositories'
import { deletePendingTask } from 'App/Core/Achievement/utils/deletePendingTask'
import { sendLegacyPendingTasks } from 'App/Core/utils/PendingTasks'

export default class AddPendingTaskAchievementSigner extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'create:pending:task:achievement:signer'

  /**
   * Command description is displayed in the "help" output
   */
  public static description =
    'This command create pending task by user not sign achievement'

  @flags.boolean({ alias: 'r', description: 'Rollback flag' })
  public rollbackCommand: boolean

  private nameFileBackupActivity: string =
    'add-pending-task-achievement-by-user.json'

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

  public async execute(): Promise<void> {
    this.logger.info('Start Process Create Pending Task')
    let index = 0
    let query: any = {
      signers: {
        $elemMatch: {
          signed: false
        }
      },
      isRejected: false
    }

    let achievement
    let cursor: any = await AchievementRepository.findByCursor(query)
    const countAchievemets: number = await AchievementRepository.count(query)
    try {
      const dataFormat: any = []
      while ((achievement = await cursor.next())) {
        achievement.signers.forEach((user) => {
          if (
            !user?.signed &&
            achievement?.crop &&
            achievement?.company &&
            achievement?.activity &&
            achievement?._id &&
            achievement?.key
          ) {
            dataFormat.push({
              userId: user?.userId,
              cropId: achievement?.crop,
              companyId: achievement?.company,
              activityId: achievement?.activity,
              achievement: achievement?._id,
              key: achievement?.key
            })
          }
        })
        index = this.processingProgressBar(index, countAchievemets)
      }
      const pendingTasks = await sendLegacyPendingTasks(0, dataFormat)

      await StorageRepository.create(
        {
          pendingTasks
        },
        this.nameFileBackupActivity
      )
      this.logger.success(`Count pending task created: ${pendingTasks?.length}`)
    } catch (error) {
      this.logger.error('error', error)
    }

    this.logger.info(`Finish create Penging Task`)
  }

  /**
   * Rollback Command
   */
  public async rollback(): Promise<void> {
    this.logger.info('Start Process Rollback Pending Task')
    let i: number = 0
    const backupFile = await StorageRepository.get(this.nameFileBackupActivity)
    const idsPendingTask = backupFile.pendingTasks.map((value) => {
      i = this.processingProgressBar(i, backupFile?.pendingTasks?.length)
      return value?._id
    })
    const removed = await deletePendingTask(idsPendingTask)
    const countRemoved = removed?.deletedCount ? removed?.deletedCount : 0
    this.logger.success(`Count Removed: ${countRemoved}`)
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
