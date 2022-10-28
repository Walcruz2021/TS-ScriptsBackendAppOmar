import { BaseCommand, flags } from '@adonisjs/core/build/standalone'
import StorageRepository from 'App/Core/Storage'
import Aws from '@ioc:Aws'
import Env from '@ioc:Adonis/Core/Env'
import UserRepository from 'App/Core/User/Infrastructure/Mongoose/Repositories'
import AchievementRepository from 'App/Core/Achievement/Infrastructure/Mongoose/Repositories'
import ActivityRepository from 'App/Core/Activity/Infrastructure/Mongoose/Repositories'
import { createEventAuditUseCase } from 'App/Core/EventsAuditEntities/Infrastructure/useCase'
import {
  EOperationTypeDataBase,
  IEntity
} from 'App/Core/EventsAuditEntities/Infrastructure/Mongoose/Interfaces/EventsAuditEntities.interface'

export default class AddAchievementSigners extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'add:achievement:activity:signers:kam'

  /**
   * Command description is displayed in the "help" output
   */
  public static description =
    'This command add signers in achievement and activity'

  private nameFileBackup: string = 'add-signers-achievement.json'

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
    this.logger.success('Started add signers in achievement and activity')
    try {
      if (this.rollbackCommand) {
        this.logger.success(
          'Started rollback add signers in achievement and activity'
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
    this.logger.success('Add signers in achievement and activity Success')
  }

  public async execute(): Promise<void> {
    let i: number = 0
    let listBackup: Array<Object> = []
    const key = await this.prompt.ask('Enter the key', {
      validate: this.validate
    })

    let data = await this.getFile(Env.get('AWS_PUBLIC_BUCKET_NAME'), key)
    let addSignersAchievement = JSON.parse(data.body.toString('utf-8'))
    let isAchievement

    for (const item of addSignersAchievement) {
      isAchievement = true
      let findUser = await UserRepository.findOne({ email: item.email })
      if (!findUser) {
        this.logger.log(`User with email ${item.email} not found`)
        continue
      }

      let findAchievement = await AchievementRepository.findOne({
        _id: item.id_achievement
      })
      let findActivity = await ActivityRepository.findOne({
        _id: item.id_achievement
      })
      if (!findAchievement) {
        if (!findActivity) {
          this.logger.log(
            `Achievement or Activity with id ${item.id_achievement} not found`
          )
          continue
        } else {
          isAchievement = false
        }
      }
      const userSignerDto = {
        signed: true,
        userId: findUser._id,
        fullName: `${findUser.firstName} ${findUser.lastName}`,
        email: findUser.email,
        type: 'KAM',
        dateSigned: new Date()
      }

      if (isAchievement) {
        await AchievementRepository.findOneAndUpdate(
          { _id: findAchievement._id },
          { $push: { signers: userSignerDto } }
        )

        const signerAchievementBackup = {
          achievementId: findAchievement._id,
          userId: findUser._id,
          userType: 'KAM',
          email: findUser.email,
          type: 'Achievement'
        }

        listBackup.push(signerAchievementBackup)
        await createEventAuditUseCase.execute(
          findAchievement._id,
          IEntity.ACHIEVEMENT,
          EOperationTypeDataBase.UPDATE
        )
      } else {
        await ActivityRepository.findOneAndUpdate(
          { _id: findActivity._id },
          { $push: { signers: userSignerDto } }
        )

        const signerActivityBackup = {
          activityId: findActivity._id,
          userId: findUser._id,
          userType: 'KAM',
          email: findUser.email,
          type: 'Activity'
        }

        listBackup.push(signerActivityBackup)
        await createEventAuditUseCase.execute(
          findActivity._id,
          IEntity.ACTIVITY,
          EOperationTypeDataBase.UPDATE
        )
      }

      i = this.processingProgressBar(i, addSignersAchievement.length)
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
      if (item.type === 'Achievement') {
        await AchievementRepository.findOneAndUpdate(
          {
            _id: item.achievementId
          },
          {
            $pull: {
              signers: {
                userId: item.userId,
                type: item.userType,
                email: item.email
              }
            }
          }
        )
      }
      if (item.type === 'Activity') {
        await ActivityRepository.findOneAndUpdate(
          {
            _id: item.activityId
          },
          {
            $pull: {
              signers: {
                userId: item.userId,
                type: item.userType,
                email: item.email
              }
            }
          }
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
