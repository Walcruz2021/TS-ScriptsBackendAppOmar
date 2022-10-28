import { BaseCommand, flags } from '@adonisjs/core/build/standalone'
import StorageRepository from 'App/Core/Storage'
import {
  EOperationTypeDataBase,
  IEntity
} from 'App/Core/EventsAuditEntities/Infrastructure/Mongoose/Interfaces/EventsAuditEntities.interface'
import { createEventAuditUseCase } from 'App/Core/EventsAuditEntities/Infrastructure/useCase'
import ActivityRepository from 'App/Core/Activity/Infrastructure/Mongoose/Repositories'
import AchievementRepository from 'App/Core/Achievement/Infrastructure/Mongoose/Repositories'
export default class UpdateSupplyLegacyActivityAchievement extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'update:supply:legacy:activity:achievement'
  /**
   * Command description is displayed in the "help" output
   */
  public static description = 'add brand in supply seed'
  @flags.boolean({ alias: 'r', description: 'Rollback flag' })
  public rollbackCommand: boolean
  private nameFileBackup: string = 'add-supply-brand.json'
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
    this.logger.success('Started add brand in supply seed')
    try {
      if (this.rollbackCommand) {
        this.logger.success('Started rollback add brand in supply seed')
        await this.rollback()
      } else {
        await this.execute()
      }
    } catch (error) {
      this.logger.error(`Error Message: ${error.message}`)
      this.logger.error(`Error: ${error}`)
    }
    this.logger.logUpdatePersist()
    this.logger.success('Add brand in supply seed Success')
  }
  public async execute(): Promise<void> {
    let i: number = 0
    let j: number = 0
    let listBackup: Array<Object> = []
    let activity
    let achievement

    const activitySuppliesCursor: any = await ActivityRepository.findByCursor(
      {
        supplies: { $exists: true, $ne: [] },
        'supplies.supply': { $ne: null },
        'supplies.brand': null,
        'supplies.code': null
      },
      [
        {
          path: 'supplies',
          populate: [{ path: 'supply' }]
        }
      ]
    )
    const achievementSuppliesCursor: any =
      await AchievementRepository.findByCursor(
        {
          supplies: { $exists: true, $ne: [] },
          'supplies.supply': { $ne: null },
          'supplies.brand': null,
          'supplies.code': null
        },
        [
          {
            path: 'supplies',
            populate: [{ path: 'supply' }]
          }
        ]
      )
    const countActivitySupply = await ActivityRepository.count({
      supplies: { $exists: true, $ne: [] },
      'supplies.supply': { $ne: null }
    })

    console.log(countActivitySupply)
    const countAchievementSupply = await AchievementRepository.count({
      supplies: { $exists: true, $ne: [] },
      'supplies.supply': { $ne: null }
    })
    while ((activity = await activitySuppliesCursor.next())) {
      for (const supply of activity.supplies) {
        if (!supply.supply || !supply.supply.brand) {
          this.logger.log(
            `Activity with id ${activity._id} doesn't have supply or supply not have brand`
          )
          continue
        }
        const activtyBackup = {
          activityId: activity._id,
          supplyId: supply._id,
          type: 'activity',
          data: activity
        }
        listBackup.push(activtyBackup)
        console.log(activtyBackup)
        await ActivityRepository.findOneAndUpdate(
          {
            _id: activity._id,
            'supplies._id': supply._id
          },
          {
            $set: {
              ['supplies.$.brand']: supply.supply.brand,
              ['supplies.$.code']: supply.supply.code
            }
          }
        )

        await createEventAuditUseCase.execute(
          activity._id,
          IEntity.ACTIVITY,
          EOperationTypeDataBase.UPDATE
        )
      }

      i = this.processingProgressBar(i, countActivitySupply)
    }

    while ((achievement = await achievementSuppliesCursor.next())) {
      for (const supply of achievement.supplies) {
        if (!supply.supply || !supply.supply.brand) {
          this.logger.log(
            `achievement with id ${achievement._id} doesn't have supply or supply not have brand`
          )
          continue
        }
        const achievementBackup = {
          achievementId: achievement._id,
          supplyId: supply._id,
          type: 'achievement',
          data: achievement
        }
        listBackup.push(achievementBackup)
        await AchievementRepository.findOneAndUpdate(
          {
            _id: achievement._id,
            'supplies._id': supply._id
          },
          {
            $set: {
              ['supplies.$.brand']: supply.supply.brand,
              ['supplies.$.code']: supply.supply.code
            }
          }
        )

        await createEventAuditUseCase.execute(
          achievement._id,
          IEntity.ACHIEVEMENT,
          EOperationTypeDataBase.UPDATE
        )
      }

      j = this.processingProgressBar(j, countAchievementSupply)
    }

    await StorageRepository.create(listBackup, this.nameFileBackup)
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
            'supplies._id': item.supply._id
          },
          {
            $unset: {
              ['supplies.$.brand']: '',
              ['supplies.$.code']: ''
            }
          }
        )
      }
      if (item.type === 'achievement') {
        await AchievementRepository.findOneAndUpdate(
          {
            _id: item.achievementId,
            'supplies._id': item.supply._id
          },
          {
            $unset: {
              ['supplies.$.brand']: '',
              ['supplies.$.code']: ''
            }
          }
        )
      }

      i = this.processingProgressBar(i, data.length)
    }
    await StorageRepository.delete(this.nameFileBackup)
  }
}
