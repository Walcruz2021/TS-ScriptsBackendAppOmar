import { BaseCommand, flags } from '@adonisjs/core/build/standalone'
import CropRepository from 'App/Core/Crop/Infrastructure/Mongoose/Repositories'
import UserRepository from 'App/Core/User/Infrastructure/Mongoose/Repositories'
import StorageRepository from 'App/Core/Storage'
import Aws from '@ioc:Aws'
import Env from '@ioc:Adonis/Core/Env'
import CountryRepository from 'App/Core/Country/Infraestructure/Mongoose/Repositories'
import { createEventAuditUseCase } from 'App/Core/EventsAuditEntities/Infrastructure/useCase'
import {
  EOperationTypeDataBase,
  IEntity
} from 'App/Core/EventsAuditEntities/Infrastructure/Mongoose/Interfaces/EventsAuditEntities.interface'
import axios from 'axios'
export default class AddMemberCrop extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'add:member:crop'

  /**
   * Command description is displayed in the "help" output
   */
  public static description = 'This command add members to all crops'

  @flags.boolean({ alias: 'r', description: 'Rollback flag' })
  public rollbackCommand: boolean

  private nameFileBackup: string = 'add-members-crop.json'

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
    this.logger.success('Started Add members to all crops')
    try {
      if (this.rollbackCommand) {
        this.logger.success('Started rollback Add members to all crops')
        await this.rollback()
      } else {
        await this.execute()
      }
    } catch (error) {
      this.logger.error(`Error Message: ${error.message}`)
      this.logger.error(`Error: ${error}`)
    }
    this.logger.logUpdatePersist()
    this.logger.success('Add members to all crops Success')
  }

  public async execute(): Promise<void> {
    let i: number = 0
    let listBackup: Array<Object> = []

    const dataUsers = await this.getPromptS3()
    const emailList = dataUsers.map((item) => item.user)
    let users = await UserRepository.findAll({ email: { $in: emailList } })

    let crops = await CropRepository.findAll({}, ['company'])

    for (const crop of crops) {
      if (!crop.company) {
        this.logger.log(`Company for crop id ${crop._id} not found`)
        continue
      }
      for (const user of users) {
        let dataUser = dataUsers.find(
          (dataUser) => dataUser.user === user.email
        )
        if (!dataUser) {
          this.logger.log(`user with email ${dataUser.user} not found`)
          continue
        }
        let country = await CountryRepository.findOne({
          alphaCode: dataUser.country
        })
        if (!country) {
          this.logger.log(`Country with email ${dataUser.country} not found`)
          continue
        }
        const userExistsInCrop = crop.members.some(
          (member) => String(member.user) === String(user._id)
        )
        if (userExistsInCrop) {
          continue
        }
        let memberDTO = {
          type: dataUser.type,
          producer: dataUser.producer,
          user: user._id,
          identifier: crop.company.identifier,
          country: country._id
        }

        const cropBackup = {
          cropId: crop._id,
          data: crop
        }
        listBackup.push(cropBackup)
        await CropRepository.findOneAndUpdate(
          { _id: crop._id },
          { $push: { members: memberDTO } }
        )

        await createEventAuditUseCase.execute(
          crop._id,
          IEntity.CROP,
          EOperationTypeDataBase.UPDATE
        )
      }
      i = this.processingProgressBar(i, crops.length)
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
      await CropRepository.update({ _id: item.cropId }, { $set: item.data })
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
