import { BaseCommand, flags } from '@adonisjs/core/build/standalone'
import StorageRepository from 'App/Core/Storage'
import SupplyRepository from 'App/Core/Supply/Infrastructure/Mongoose/Repositories'
import Aws from '@ioc:Aws'

export default class SupplyWithoutName extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'supply:without:name'

  /**
   * Command description is displayed in the "help" output
   */
  public static description = 'This command add name to supply without name'

  @flags.boolean({ alias: 'r', description: 'Rollback flag' })
  public rollbackCommand: boolean

  private nameFileBackup: string = 'supply-without-name.json'

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
    this.logger.success('Started add name to supply without name')
    try {
      if (this.rollbackCommand) {
        this.logger.success('Started rollback add name to supply without name')
        await this.rollback()
      } else {
        await this.execute()
      }
    } catch (error) {
      this.logger.error(`Error Message: ${error.message}`)
      this.logger.error(`Error: ${error}`)
    }
    this.logger.logUpdatePersist()
    this.logger.success('Add name to supply without name Success')
  }

  public async execute(): Promise<void> {
    let i: number = 0
    let listBackup: Array<Object> = []
    let activityBackup
    const bucket = await this.prompt.ask('Enter the bucket', {
      validate: this.validate
    })
    const key = await this.prompt.ask('Enter the key', {
      validate: this.validate
    })

    let data = await this.getFile(bucket, key)
    let SupplyWithoutNameData = JSON.parse(data.body.toString('utf-8'))

    for (const item of SupplyWithoutNameData) {
      if (item.supply_brand) {
        activityBackup = {
          supplyId: item.id_supply,
          type: 'brand'
        }
        await SupplyRepository.findOneAndUpdate(
          {
            _id: item.id_supply
          },
          { name: item.supply_brand }
        )
      } else {
        activityBackup = {
          supplyId: item.id_supply,
          type: 'code'
        }
        await SupplyRepository.findOneAndUpdate(
          {
            _id: item.id_supply
          },
          { name: item.supply_code, brand: item.supply_code }
        )
      }
      listBackup.push(activityBackup)

      i = this.processingProgressBar(i, SupplyWithoutNameData.length)
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
      if (item.type === 'brand') {
        await SupplyRepository.findOneAndUpdate(
          {
            _id: item.supplyId
          },
          { name: '' }
        )
      }
      if (item.type === 'code') {
        await SupplyRepository.findOneAndUpdate(
          {
            _id: item.supplyId
          },
          { name: '', brand: '#NAME?' }
        )
      }

      i = this.processingProgressBar(i, data.length)
    }

    await StorageRepository.delete(this.nameFileBackup)
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
}
