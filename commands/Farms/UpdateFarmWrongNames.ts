import { BaseCommand, flags } from '@adonisjs/core/build/standalone'
import StorageRepository from 'App/Core/Storage'
import Aws from '@ioc:Aws'
import Env from '@ioc:Adonis/Core/Env'
import { createEventAuditUseCase } from 'App/Core/EventsAuditEntities/Infrastructure/useCase'
import {
  EOperationTypeDataBase,
  IEntity
} from 'App/Core/EventsAuditEntities/Infrastructure/Mongoose/Interfaces/EventsAuditEntities.interface'
import axios from 'axios'
import FarmRepository from 'App/Core/Farm/Infrastructure/Mongoose/Repositories'
import LotRepository from 'App/Core/Lot/Infrastructure/Mongoose/Repositories'
export default class UpdateFarmWrongNames extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'update:farm:wrong:names'

  /**
   * Command description is displayed in the "help" output
   */
  public static description =
    'This command update farm in lots with wrong names'

  @flags.boolean({ alias: 'r', description: 'Rollback flag' })
  public rollbackCommand: boolean

  private nameFileBackup: string = 'update-farms-wrong-names.json'

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
    this.logger.success('Started update farm in lots with wrong names')
    try {
      if (this.rollbackCommand) {
        this.logger.success('Started update farm in lots with wrong names')
        await this.rollback()
      } else {
        await this.execute()
      }
    } catch (error) {
      this.logger.error(`Error Message: ${error.message}`)
      this.logger.error(`Error: ${error}`)
    }
    this.logger.logUpdatePersist()
    this.logger.success('Update farm in lots with wrong names Success')
  }

  public async execute(): Promise<void> {
    let i: number = 0
    let listBackup: Array<Object> = []

    const dataFarms = await this.getPromptS3()

    for (const data of dataFarms) {
      let badFarm = await FarmRepository.findOne({ name: data.badFarm })
      if (!badFarm) {
        this.logger.log(`Bad Farm with name ${data.badFarm} not found`)
        continue
      }
      let goodFarm = await FarmRepository.findOne({ name: data.goodFarm })
      if (!goodFarm) {
        this.logger.log(`Good Farm with name ${data.goodFarm} not found`)
        continue
      }
      let lotsBadFarm = await LotRepository.findAll({ farm: badFarm._id })

      for (const lot of lotsBadFarm) {
        const lotBackup = {
          lotId: lot._id,
          type: 'lot',
          data: lot
        }
        listBackup.push(lotBackup)
        await LotRepository.findOneAndUpdate(
          { _id: lot._id },
          { $set: { farm: goodFarm._id, uuid: goodFarm.uuid } }
        )

        await createEventAuditUseCase.execute(
          lot._id,
          IEntity.LOT,
          EOperationTypeDataBase.UPDATE
        )
      }
      const farmBackup = {
        farmId: badFarm._id,
        type: 'farm',
        data: badFarm
      }
      listBackup.push(farmBackup)
      await FarmRepository.deleteOne({ _id: badFarm._id })
      await createEventAuditUseCase.execute(
        badFarm._id,
        IEntity.FARM,
        EOperationTypeDataBase.DELETE
      )
      i = this.processingProgressBar(i, dataFarms.length)
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
      if (item.type === 'lot') {
        await LotRepository.update({ _id: item.lotId }, { $set: item.data })
      }
      if (item.type === 'farm') {
        await FarmRepository.create(item.data)
      }
      i = this.processingProgressBar(i, data.length)
    }

    await StorageRepository.delete(this.nameFileBackup)
  }

  async getPromptS3() {
    const bucket = Env.get('AWS_PUBLIC_BUCKET_NAME')
    const hasUrl = await this.prompt.toggle('It has an s3 url?', ['Yes', 'Not'])
    if (hasUrl) {
      const url = await this.prompt.ask('Enter the url', {
        validate: this.validate
      })
      return await this.getFileByUrl(url)
    } else {
      const key = await this.prompt.ask('Enter the key', {
        validate: this.validate
      })
      let data = await this.getFile(bucket, key)
      return JSON.parse(data.body.toString('utf-8'))
    }
  }
  async getFileByUrl(url): Promise<any> {
    this.logger.await('Waiting for the data in S3')
    const response = await axios.get(url, { responseType: 'json' })
    return response.data
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
