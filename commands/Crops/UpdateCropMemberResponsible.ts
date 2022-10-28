import { BaseCommand, flags } from '@adonisjs/core/build/standalone'
import StorageRepository from 'App/Core/Storage'
import Aws from '@ioc:Aws'
import Env from '@ioc:Adonis/Core/Env'
import { createEventAuditUseCase } from 'App/Core/EventsAuditEntities/Infrastructure/useCase'
import {
  EOperationTypeDataBase,
  IEntity
} from 'App/Core/EventsAuditEntities/Infrastructure/Mongoose/Interfaces/EventsAuditEntities.interface'
import CropRepository from 'App/Core/Crop/Infrastructure/Mongoose/Repositories'
import UserRepository from 'App/Core/User/Infrastructure/Mongoose/Repositories'

export default class UpdateCropMemberResponsible extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'update:crop:member:responsible'

  /**
   * Command description is displayed in the "help" output
   */
  public static description = 'This command update crop member to responsible'

  private nameFileBackup: string = 'update-cropResponsible.json'

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
    this.logger.success('Started update crop member to responsible')
    try {
      if (this.rollbackCommand) {
        this.logger.success(
          'Started rollback update crop member to responsible'
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
    this.logger.success('Update crop member to responsible Success')
  }

  public async execute(): Promise<void> {
    let i: number = 0
    let listBackup: Array<Object> = []
    const key = await this.prompt.ask('Enter the key', {
      validate: this.validate
    })

    let data = await this.getFile(Env.get('AWS_PUBLIC_BUCKET_NAME'), key)
    let updateCropMember = JSON.parse(data.body.toString('utf-8'))

    for (const item of updateCropMember) {
      let findCrop = await CropRepository.findOne({
        _id: item.idCrop,
        'members.user': item.idUser
      })
      let findUser = await UserRepository.findOne({ _id: item.idUser })

      if (findCrop && findUser) {
        const cropBackup = {
          cropId: findCrop._id,
          userId: findUser._id
        }
        listBackup.push(cropBackup)

        await CropRepository.findOneAndUpdate(
          {
            _id: findCrop._id,
            'members.user': findUser._id
          },
          { $set: { 'members.$.tag': 'ucropit_adviser' } }
        )
        await createEventAuditUseCase.execute(
          findCrop._id,
          IEntity.CROP,
          EOperationTypeDataBase.UPDATE
        )
      }

      i = this.processingProgressBar(i, updateCropMember.length)
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
      await CropRepository.findOneAndUpdate(
        {
          _id: item.cropId,
          'members.user': item.userId
        },
        { $unset: { 'members.$.tag': '' } }
      )

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
