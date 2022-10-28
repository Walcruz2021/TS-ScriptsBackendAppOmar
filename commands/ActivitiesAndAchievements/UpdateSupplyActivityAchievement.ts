import { BaseCommand, flags } from '@adonisjs/core/build/standalone'
import Aws from '@ioc:Aws'
import Env from '@ioc:Adonis/Core/Env'
import { createEventAuditUseCase } from 'App/Core/EventsAuditEntities/Infrastructure/useCase'
import {
  EOperationTypeDataBase,
  IEntity
} from 'App/Core/EventsAuditEntities/Infrastructure/Mongoose/Interfaces/EventsAuditEntities.interface'
import ActivityRepository from 'App/Core/Activity/Infrastructure/Mongoose/Repositories'
import SupplyRepository from 'App/Core/Supply/Infrastructure/Mongoose/Repositories'

import StorageRepository from 'App/Core/Storage'
import AchievementRepository from 'App/Core/Achievement/Infrastructure/Mongoose/Repositories'

export default class UpdateSupplyActivityAchievement extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'update:supply:activity:achievement'

  /**
   * Command description is displayed in the "help" output
   */
  public static description =
    'This command update supply in activities and achievements'

  @flags.boolean({ alias: 'r', description: 'Rollback flag' })
  public rollbackCommand: boolean

  private nameFileBackup: string = 'supply-update-activity-achievement.json'

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
    this.logger.success('Started Update Supply in activity and achievement')
    try {
      if (this.rollbackCommand) {
        this.logger.success(
          'Started rollback Update Supply in activity and achievement'
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
    this.logger.success('Update Supply in activity and achievement Success')
  }

  public async execute(): Promise<void> {
    let i: number = 0
    let listBackup: Array<Object> = []
    const key = await this.prompt.ask('Enter the key', {
      validate: this.validate
    })

    let data = await this.getFile(Env.get('AWS_PUBLIC_BUCKET_NAME'), key)
    let updateSupplyActivityAchievement = JSON.parse(
      data.body.toString('utf-8')
    )

    for (const item of updateSupplyActivityAchievement) {
      if (item.activities && item.activities.length > 0) {
        let findSupplyNew = await SupplyRepository.findOne({
          _id: item.idSupplyNew
        })

        if (!findSupplyNew) {
          this.logger.log(`Supply with id ${item.idSupplyNew} not found`)
          continue
        }
        for (const activity of item.activities) {
          let findActivity = await ActivityRepository.findOne({
            _id: activity,
            'supplies.supply': item.idSupplyOld
          })

          if (!findActivity) {
            this.logger.log(
              `Activity with id ${activity} and supply id ${item.idSupplyOld} not found`
            )
            continue
          }

          const activityBackup = {
            activityId: findActivity._id,
            data: findActivity,
            type: 'activity'
          }
          listBackup.push(activityBackup)
          await ActivityRepository.findOneAndUpdate(
            {
              _id: findActivity._id,
              'supplies.supply': item.idSupplyOld
            },
            {
              $set: {
                ['supplies.$.supply']: findSupplyNew._id,
                ['supplies.$.code']: findSupplyNew.code
              }
            }
          )
          await createEventAuditUseCase.execute(
            findActivity._id,
            IEntity.ACTIVITY,
            EOperationTypeDataBase.UPDATE
          )
        }
      }

      if (item.achievement && item.achievement.length > 0) {
        if (!item.idSupplyNew) {
          continue
        }
        let findSupplyNew = await SupplyRepository.findOne({
          _id: item.idSupplyNew
        })

        if (!findSupplyNew) {
          this.logger.log(`Supply with id ${item.idSupplyNew} not found`)
          continue
        }
        for (const achievement of item.achievement) {
          let findAchievement = await AchievementRepository.findOne({
            _id: achievement,
            'supplies.supply': item.idSupplyOld
          })

          if (!findAchievement) {
            this.logger.log(
              `Achievement with id ${achievement} and supply id ${item.idSupplyOld} not found`
            )
            continue
          }

          const achievementBackup = {
            achievementId: findAchievement._id,
            data: findAchievement,
            type: 'achievement'
          }
          listBackup.push(achievementBackup)
          await AchievementRepository.findOneAndUpdate(
            {
              _id: findAchievement._id,
              'supplies.supply': item.idSupplyOld
            },
            {
              $set: {
                ['supplies.$.supply']: findSupplyNew._id,
                ['supplies.$.code']: findSupplyNew.code
              }
            }
          )
          await createEventAuditUseCase.execute(
            findAchievement._id,
            IEntity.ACHIEVEMENT,
            EOperationTypeDataBase.UPDATE
          )
        }
      }
      i = this.processingProgressBar(i, updateSupplyActivityAchievement.length)
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
        await ActivityRepository.update(
          { _id: item.activityId },
          { $set: item.data }
        )
      }
      if (item.type === 'achievement') {
        await AchievementRepository.update(
          { _id: item.achievementId },
          { $set: item.data }
        )
      }

      i = this.processingProgressBar(i, data.length)
    }
    await StorageRepository.delete(this.nameFileBackup)
  }

  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  async getFile(bucket: string, key: string): Promise<any> {
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
