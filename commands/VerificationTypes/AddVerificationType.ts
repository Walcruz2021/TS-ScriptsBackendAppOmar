import { BaseCommand, flags } from '@adonisjs/core/build/standalone'
import CropTypeRepository from 'App/Core/CropType/Infraestructure/Mongoose/Repositories'
import CompanyRepository from 'App/Core/Company/Infrastructure/Mongoose/Repositories'
import StorageRepository from 'App/Core/Storage'
import Aws from '@ioc:Aws'
import Env from '@ioc:Adonis/Core/Env'
import { createEventAuditUseCase } from 'App/Core/EventsAuditEntities/Infrastructure/useCase'
import {
  EOperationTypeDataBase,
  IEntity
} from 'App/Core/EventsAuditEntities/Infrastructure/Mongoose/Interfaces/EventsAuditEntities.interface'
import VerificationTypeRepository from 'App/Core/VerificationType/Infrastructure/Mongoose/Repositories'
import { VerificationType } from 'App/Core/VerificationType/Infrastructure/Mongoose/Interfaces'
export default class AddVerificationType extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'add:verificationTypes'

  /**
   * Command description is displayed in the "help" output
   */
  public static description = 'This command add verification type'

  private nameFileBackup: string = 'add-verificationType.json'

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
    this.logger.success('Started add verification type')
    try {
      if (this.rollbackCommand) {
        this.logger.success('Started rollback add verification type')
        await this.rollback()
      } else {
        await this.execute()
      }
    } catch (error) {
      this.logger.error(`Error Message: ${error.message}`)
      this.logger.error(`Error: ${error}`)
    }
    this.logger.logUpdatePersist()
    this.logger.success('Add verification type Success')
  }

  public async execute(): Promise<void> {
    let i: number = 0
    let listBackup: Array<Object> = []
    const key = await this.prompt.ask('Enter the key', {
      validate: this.validate
    })

    let data = await this.getFile(Env.get('AWS_PUBLIC_BUCKET_NAME'), key)
    let addVerificationType = JSON.parse(data.body.toString('utf-8'))

    for (const item of addVerificationType) {
      if (!item.cropTypes.length) {
        this.logger.log('Crop type is required')
        continue
      }

      if (!item.companies.length) {
        this.logger.log('Company is required')
        continue
      }

      let cropTypes = item.cropTypes.map(async (data) => {
        let cropType = await CropTypeRepository.findOne({ _id: data.cropType })
        if (!cropType) {
          this.logger.log(`Crop type ${data.cropType} not found`)
          return
        }
        return cropType
      })

      let companies = item.companies.map(async (data) => {
        let company = await CompanyRepository.findOne({ _id: data.company })
        if (!company) {
          this.logger.log(`Company ${data.company} not found`)
          return
        }
        return company
      })

      if (
        companies.length !== item.companies.length ||
        cropTypes.length !== item.cropTypes.length
      ) {
        this.logger.log('Crop type or company not found')
        continue
      }

      let checkVerificationType = await VerificationTypeRepository.findOne({
        key: item.key
      })

      if (checkVerificationType) {
        this.logger.log(`Verification type ${item.key} already exists`)
        continue
      }

      let verificationTypeDto: VerificationType = {
        key: item.key,
        name: {},
        companies: item.companies,
        cropTypes: item.cropTypes
      }

      item.name.en ? (verificationTypeDto.name.en = item.name.en) : null
      item.name.es ? (verificationTypeDto.name.es = item.name.es) : null
      item.name.pt ? (verificationTypeDto.name.pt = item.name.pt) : null

      let verificationType = await VerificationTypeRepository.create(
        verificationTypeDto
      )

      await createEventAuditUseCase.execute(
        verificationType._id,
        IEntity.VERIFICATIONTYPE,
        EOperationTypeDataBase.CREATE
      )

      const verificationTypeBackup = {
        verificationTypeId: verificationType._id,
        type: 'create'
      }

      listBackup.push(verificationTypeBackup)
    }
    i = this.processingProgressBar(i, addVerificationType.length)

    await StorageRepository.create(listBackup, this.nameFileBackup)
  }

  /**
   * Rollback Command
   */
  public async rollback(): Promise<void> {
    let i: number = 0
    const data = await StorageRepository.get(this.nameFileBackup)

    for (const item of data) {
      await VerificationTypeRepository.deleteOne({
        _id: item.verificationTypeId
      })

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
