import { BaseCommand, flags } from '@adonisjs/core/build/standalone'
import StorageRepository from 'App/Core/Storage'
import Aws from '@ioc:Aws'
import Env from '@ioc:Adonis/Core/Env'
import { createEventAuditUseCase } from 'App/Core/EventsAuditEntities/Infrastructure/useCase'
import {
  EOperationTypeDataBase,
  IEntity
} from 'App/Core/EventsAuditEntities/Infrastructure/Mongoose/Interfaces/EventsAuditEntities.interface'
import UserRepository from 'App/Core/User/Infrastructure/Mongoose/Repositories'
import CropRepository from 'App/Core/Crop/Infrastructure/Mongoose/Repositories'
import AchievementRepository from 'App/Core/Achievement/Infrastructure/Mongoose/Repositories'

export default class UpdateSignersAchievementsByCrop extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'update:signers:achievements:by:crop'

  /**
   * Command description is displayed in the "help" output
   */
  public static description = 'This command update signer achievements'

  private nameFileBackup: string = 'update-signers-achivements-crop.json'

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
    this.logger.success('Started update signers achievements')
    try {
      if (this.rollbackCommand) {
        this.logger.success('Started rollback update signers achievements')
        await this.rollback()
      } else {
        await this.execute()
      }
    } catch (error) {
      this.logger.error(`Error Message: ${error.message}`)
      this.logger.error(`Error: ${error}`)
    }
    this.logger.logUpdatePersist()
    this.logger.success('Update signers achievements Success')
  }

  public async execute(): Promise<void> {
    let i: number = 0
    let listBackup: Array<Object> = []
    const key = await this.prompt.ask('Enter the key', {
      validate: this.validate
    })

    let data = await this.getFile(Env.get('AWS_PUBLIC_BUCKET_NAME'), key)
    let updateSignersAchievement = JSON.parse(data.body.toString('utf-8'))

    let user = await UserRepository.findOne({
      _id: updateSignersAchievement.userId
    })

    let crop = await CropRepository.findOneWithActivityAchievementPopulate({
      _id: updateSignersAchievement.cropId
    })

    if (user && crop && crop.done.length) {
      const userMemberDto = {
        type: 'PRODUCER',
        producer: true,
        user: user._id,
        identifier: '20255985621'
      }
      const userSignDto = {
        signed: false,
        userId: user._id,
        fullName: `${user.firstName} ${user.lastName}`,
        email: user.email,
        type: 'PRODUCER',
        dateSigned: Date.now()
      }

      const cropUser = await CropRepository.findOne({
        _id: crop._id,
        'members.user': user._id
      })

      if (!cropUser) {
        await CropRepository.findOneAndUpdate(
          { _id: crop._id },
          { $push: { members: userMemberDto } }
        )
        const updateBackup = {
          cropId: crop._id,
          userId: user._id,
          type: 'crop'
        }

        listBackup.push(updateBackup)
        await createEventAuditUseCase.execute(
          crop._id,
          IEntity.CROP,
          EOperationTypeDataBase.UPDATE
        )
      }

      const activitiesDone = crop.done
      for (const activity of activitiesDone) {
        for (const achievement of activity.achievements) {
          const userAchievement = await AchievementRepository.findOne({
            _id: achievement._id,
            'signers.userId': user._id
          })

          if (!userAchievement) {
            await AchievementRepository.findOneAndUpdate(
              { _id: achievement._id },
              { $push: { signers: userSignDto } }
            )

            const updateBackup = {
              achievementId: achievement._id,
              userId: user._id,
              type: 'achievement'
            }

            listBackup.push(updateBackup)

            await createEventAuditUseCase.execute(
              achievement._id,
              IEntity.ACHIEVEMENT,
              EOperationTypeDataBase.UPDATE
            )
          }
        }
        i = this.processingProgressBar(i, activity.achievements.length)
      }
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
      if (item.type === 'crop') {
        await CropRepository.findOneAndUpdate(
          {
            _id: item.cropId
          },
          { $pull: { 'members.user': item.userId } }
        )
      }

      if (item.type === 'achievement') {
        await AchievementRepository.findOneAndUpdate(
          {
            _id: item.achievementId
          },
          { $pull: { 'signers.userId': item.userId } }
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
