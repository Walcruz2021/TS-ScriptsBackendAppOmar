import { BaseCommand, flags } from '@adonisjs/core/build/standalone'
import AchievementRepository from 'App/Core/Achievement/Infrastructure/Mongoose/Repositories'
import StorageRepository from 'App/Core/Storage'
import Aws from '@ioc:Aws'
import Env from '@ioc:Adonis/Core/Env'
import { createEventAuditUseCase } from 'App/Core/EventsAuditEntities/Infrastructure/useCase'
import {
  EOperationTypeDataBase,
  IEntity
} from 'App/Core/EventsAuditEntities/Infrastructure/Mongoose/Interfaces/EventsAuditEntities.interface'
import SupplyRepository from 'App/Core/Supply/Infrastructure/Mongoose/Repositories'

export default class UpdateAchievementSupplies extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'update:achievement:supplies'

  /**
   * Command description is displayed in the "help" output
   */
  public static description = 'This command update achievement supplies'

  private nameFileBackup: string = 'update-achievement-supplies.json'

  @flags.boolean({ alias: 'r', description: 'Rollback flag' })
  public rollbackCommand: boolean

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
    this.logger.success('Started update achievement supplies')
    try {
      if (this.rollbackCommand) {
        this.logger.success('Started rollback update achievement supplies')
        await this.rollback()
      } else {
        await this.execute()
      }
    } catch (error) {
      this.logger.error(`Error Message: ${error.message}`)
      this.logger.error(`Error: ${error}`)
    }
    this.logger.logUpdatePersist()
    this.logger.success('Update achievement supplies Success')
  }

  public async execute(): Promise<void> {
    let i: number = 0
    let listBackup: Array<Object> = []
    const key = await this.prompt.ask('Enter the key', {
      validate: this.validate
    })

    let data = await this.getFile(Env.get('AWS_PUBLIC_BUCKET_NAME'), key)
    let achievements = JSON.parse(data.body.toString('utf-8'))

    for (const data of achievements) {
      let findAchievement: any = await AchievementRepository.findOnePopulate({
        _id: data.idAchievement
      })

      if (!findAchievement) {
        this.logger.log(`Achievement with id ${data.idAchievement} not found`)
        continue
      }

      for (const item of findAchievement.supplies) {
        if (item.supply) {
          continue
        }
        const achievementBackup = {
          achievementId: findAchievement._id,
          data: findAchievement
        }
        listBackup.push(achievementBackup)

        let activitySupply = findAchievement.activity.supplies.find(
          (supply) => supply.name === item.name
        )

        if (!activitySupply) {
          this.logger.log(`Not find supply in activity with name ${item.name}`)
          continue
        }

        let findSupply = await SupplyRepository.findOne({
          _id: activitySupply.supply
        })

        if (!activitySupply) {
          this.logger.log(`Not find supply with id ${activitySupply.supply}`)
          continue
        }

        await AchievementRepository.findOneAndUpdate(
          {
            _id: findAchievement._id,
            'supplies._id': item._id
          },
          {
            $set: {
              ['supplies.$.supply']: activitySupply.supply,
              ['supplies.$.unitTypeSupply']: findSupply.unitTypeSupply
            }
          }
        )
        await createEventAuditUseCase.execute(
          findAchievement._id,
          IEntity.ACHIEVEMENT,
          EOperationTypeDataBase.UPDATE
        )
      }

      i = this.processingProgressBar(i, achievements.length)
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
      await AchievementRepository.update(
        { _id: item.achievementId },
        { $set: item.data }
      )

      i = this.processingProgressBar(i, data.length)
    }

    await StorageRepository.delete(this.nameFileBackup)
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
