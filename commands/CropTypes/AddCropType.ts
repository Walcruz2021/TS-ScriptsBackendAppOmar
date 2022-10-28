import { BaseCommand, flags } from '@adonisjs/core/build/standalone'
import CropTypeRepository from 'App/Core/CropType/Infraestructure/Mongoose/Repositories'
import StorageRepository from 'App/Core/Storage'
import Aws from '@ioc:Aws'
import Env from '@ioc:Adonis/Core/Env'
import { createEventAuditUseCase } from 'App/Core/EventsAuditEntities/Infrastructure/useCase'
import {
  EOperationTypeDataBase,
  IEntity
} from 'App/Core/EventsAuditEntities/Infrastructure/Mongoose/Interfaces/EventsAuditEntities.interface'
import { CropType } from 'App/Core/CropType/Infraestructure/Mongoose/Interfaces'

export default class AddCropType extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'add:cropType'

  /**
   * Command description is displayed in the "help" output
   */
  public static description = 'This command add crop types'

  private nameFileBackup: string = 'add-cropType.json'

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
    this.logger.success('Started add crop types')
    try {
      if (this.rollbackCommand) {
        this.logger.success('Started rollback add crop types')
        await this.rollback()
      } else {
        await this.execute()
      }
    } catch (error) {
      this.logger.error(`Error Message: ${error.message}`)
      this.logger.error(`Error: ${error}`)
    }
    this.logger.logUpdatePersist()
    this.logger.success('Add crop types Success')
  }

  public async execute(): Promise<void> {
    let i: number = 0
    let listBackup: Array<Object> = []
    const key = await this.prompt.ask('Enter the key', {
      validate: this.validate
    })

    let data = await this.getFile(Env.get('AWS_PUBLIC_BUCKET_NAME'), key)
    let addCropTypes = JSON.parse(data.body.toString('utf-8'))

    for (const item of addCropTypes) {
      let cropType = await CropTypeRepository.findOne({ key: item.key })

      if (!cropType) {
        let cropTypeDto: CropType = {
          key: item.key,
          name: {}
        }

        item.nameEn ? (cropTypeDto.name.en = item.nameEn) : null
        item.nameEs ? (cropTypeDto.name.es = item.nameEs) : null
        item.namePt ? (cropTypeDto.name.pt = item.namePt) : null

        let cropType = await CropTypeRepository.create(cropTypeDto)

        await createEventAuditUseCase.execute(
          cropType._id,
          IEntity.CROPTYPE,
          EOperationTypeDataBase.CREATE
        )

        const cropTypeBackup = {
          cropTypeId: cropType._id
        }

        listBackup.push(cropTypeBackup)
      }
      i = this.processingProgressBar(i, addCropTypes.length)
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
      await CropTypeRepository.deleteOne({ _id: item.cropTypeId })

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
