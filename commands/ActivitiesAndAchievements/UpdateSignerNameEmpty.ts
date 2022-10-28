import { BaseCommand, flags } from '@adonisjs/core/build/standalone'
import StorageRepository from 'App/Core/Storage'
import ActivityRepository from 'App/Core/Activity/Infrastructure/Mongoose/Repositories'
import AchievementRepository from 'App/Core/Achievement/Infrastructure/Mongoose/Repositories'
import {
  EOperationTypeDataBase,
  IEntity
} from 'App/Core/EventsAuditEntities/Infrastructure/Mongoose/Interfaces/EventsAuditEntities.interface'
import { createEventAuditUseCase } from 'App/Core/EventsAuditEntities/Infrastructure/useCase'
export default class UpdateSignerNameEmpty extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'update:signer:name:empty'

  /**
   * Command description is displayed in the "help" output
   */
  public static description = 'update signer name empty'

  @flags.boolean({ alias: 'r', description: 'Rollback flag' })
  public rollbackCommand: boolean

  private nameFileBackup: string = 'update-signer-name-empty.json'

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

  public async run() {
    this.logger.success('Started update signer name empty')
    try {
      if (this.rollbackCommand) {
        this.logger.success('Started rollback update signer name empty')
        await this.rollback()
      } else {
        await this.execute()
      }
    } catch (error) {
      this.logger.error(`Error Message: ${error.message}`)
      this.logger.error(`Error: ${error}`)
    }
    this.logger.logUpdatePersist()
    this.logger.success('Update signer name empty Success')
  }

  public async execute(): Promise<void> {
    let i: number = 0
    let j: number = 0
    let listAchievementBackup: Array<Object> = []
    let listActivityBackup: Array<Object> = []
    let activity
    let achievement
    const cursorAchievement = await AchievementRepository.findByCursorWithUser({
      'signers.fullName': ' '
    })
    const countAchievement: number = await AchievementRepository.count({
      'signers.fullName': ' '
    })

    const cursorActivity = await ActivityRepository.findByCursorWithUser({
      'signers.fullName': ' '
    })
    const countActivity: number = await ActivityRepository.count({
      'signers.fullName': ' '
    })

    while ((activity = await cursorActivity.next())) {
      const signers = activity.signers.filter(
        (signer) => signer['fullName'] === ' '
      )
      if (signers.length) {
        for (const signer of signers) {
          // console.log('activity ' + activity._id.toString())
          // console.log('signers._id ' + signer._id.toString())
          const activityBackup = {
            activityId: activity._id,
            signerId: signer._id,
            type: 'activity'
          }
          listActivityBackup.push(activityBackup)
          await ActivityRepository.findOneAndUpdate(
            {
              _id: activity._id,
              'signers._id': signer._id
            },
            {
              $set: {
                'signers.$.fullName': `${signer.userId.firstName} ${signer.userId.lastName}`
              }
            }
          )

          await createEventAuditUseCase.execute(
            activity._id,
            IEntity.ACTIVITY,
            EOperationTypeDataBase.UPDATE
          )
        }
      }
      i = this.processingProgressBar(i, countActivity)
    }

    while ((achievement = await cursorAchievement.next())) {
      const signers = achievement.signers.filter(
        (signer) => signer['fullName'] === ' '
      )
      if (signers.length) {
        for (const signer of signers) {
          // console.log('achievement ' + achievement._id.toString())
          // console.log('signers._id ' + signer._id.toString())
          const achievementBackup = {
            achievementId: achievement._id,
            signerId: signer._id,
            type: 'achievement'
          }
          listAchievementBackup.push(achievementBackup)
          await AchievementRepository.findOneAndUpdate(
            {
              _id: achievement._id,
              'signers._id': signer._id
            },
            {
              $set: {
                'signers.$.fullName': `${signer.userId.firstName} ${signer.userId.lastName}`
              }
            }
          )
          await createEventAuditUseCase.execute(
            achievement._id,
            IEntity.ACHIEVEMENT,
            EOperationTypeDataBase.UPDATE
          )
        }
      }
      j = this.processingProgressBar(j, countAchievement)
    }

    let backup = listActivityBackup.concat(listAchievementBackup)

    await StorageRepository.create(backup, this.nameFileBackup)
  }

  /**
   * Rollback Command
   */
  public async rollback(): Promise<void> {
    let i: number = 0
    const data = await StorageRepository.get(this.nameFileBackup)

    for (const item of data) {
      if (item.type === 'activity') {
        await ActivityRepository.findOneAndUpdate(
          {
            _id: item.activityId,
            'signers._id': item.signerId
          },
          { $set: { 'signers.$.fullName': ' ' } }
        )
      }
      if (item.type === 'achievement') {
        await AchievementRepository.findOneAndUpdate(
          {
            _id: item.achievementId,
            'signers._id': item.signerId
          },
          { $set: { 'signers.$.fullName': ' ' } }
        )
      }
      i = this.processingProgressBar(i, data.length)
    }

    //await StorageRepository.delete(this.nameFileBackup)
  }
}
