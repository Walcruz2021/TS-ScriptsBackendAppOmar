import { BaseCommand, flags } from '@adonisjs/core/build/standalone'
import StorageRepository from 'App/Core/Storage'
import Aws from '@ioc:Aws'
import Env from '@ioc:Adonis/Core/Env'
import { createEventAuditUseCase } from 'App/Core/EventsAuditEntities/Infrastructure/useCase'
import {
  EOperationTypeDataBase,
  IEntity
} from 'App/Core/EventsAuditEntities/Infrastructure/Mongoose/Interfaces/EventsAuditEntities.interface'
import SupplyRepository from 'App/Core/Supply/Infrastructure/Mongoose/Repositories'
import UnitTypeSupply from 'App/Core/UnitTypeSupply/Infrastructure/Mongoose/Models/UnitTypeSupply'
import axios from 'axios'
export default class UpdateSupplyUnitTypeSupply extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'update:supply:unittypesupply'
  /**
   * Command description is displayed in the "help" output
   */
  public static description = 'This command update unitTypeSupply in supply'
  private nameFileBackup: string = 'update-supply-unitTypeSupply.json'
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
    this.logger.success('Started update unitTypeSupply in supply')
    try {
      if (this.rollbackCommand) {
        this.logger.success('Started rollback update unitTypeSupply in supply')
        await this.rollback()
      } else {
        await this.execute()
      }
    } catch (error) {
      this.logger.error(`Error Message: ${error.message}`)
      this.logger.error(`Error: ${error}`)
    }
    this.logger.logUpdatePersist()
    this.logger.success('Update unitTypeSupply in supply Success')
  }
  public async execute(): Promise<void> {
    let i: number = 0
    let listBackup: Array<Object> = []

    const supplyData = await this.getPromptS3()

    for (const item of supplyData) {
      console.log(item)
      let findSupply = await SupplyRepository.findOne({
        code: item.code,
        alphaCode: item.alphaCode,
        supplyType: item.supplyType
      })
      if (!findSupply) {
        this.logger.log(
          `Supply with code ${item.code} and alpha code ${item.alphaCode} and supply Type ${item.supplyType} found`
        )
        continue
      }
      let findUnitTypeSupply = await UnitTypeSupply.findOne({
        key: item.keyUnitTypeSupply
      })
      if (!findUnitTypeSupply) {
        this.logger.log(
          `Unit Type Supply with key ${item.keyUnitTypeSupply} not found`
        )
        continue
      }
      const supplyBackup = {
        supplyId: findSupply._id,
        data: findSupply
      }
      listBackup.push(supplyBackup)
      await SupplyRepository.findOneAndUpdate(
        {
          _id: findSupply._id
        },
        { $set: { unitTypeSupply: findUnitTypeSupply, brand: item.brand } }
      )
      await createEventAuditUseCase.execute(
        findSupply._id,
        IEntity.SUPPLY,
        EOperationTypeDataBase.UPDATE
      )
      i = this.processingProgressBar(i, supplyData.length)
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
      await SupplyRepository.update({ _id: item.supplyId }, { $set: item.data })
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
