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
import CompanyRepository from 'App/Core/Company/Infrastructure/Mongoose/Repositories'
import UserRepository from 'App/Core/User/Infrastructure/Mongoose/Repositories'

export default class DeleteMemberCrop extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'delete:member:crop'
  /**
   * Command description is displayed in the "help" output
   */
  public static description = 'This command delete member in crop'

  private nameFileBackup: string = 'delete-member-crop.json'

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
    this.logger.success('Started delete member crop')
    try {
      if (this.rollbackCommand) {
        this.logger.success('Started rollback delete member crop')
        await this.rollback()
      } else {
        await this.execute()
      }
    } catch (error) {
      this.logger.error(`Error Message: ${error.message}`)
      this.logger.error(`Error: ${error}`)
    }
    this.logger.logUpdatePersist()
    this.logger.success('Delete member crop Success')
  }

  public async execute(): Promise<void> {
    let i: number = 0
    let listBackup: Array<Object> = []
    const key = await this.prompt.ask('Enter the key', {
      validate: this.validate
    })

    let data = await this.getFile(Env.get('AWS_PUBLIC_BUCKET_NAME'), key)
    let deleteMemberCrop = JSON.parse(data.body.toString('utf-8'))

    for (const item of deleteMemberCrop) {
      let findCrop = await CropRepository.findOne({
        _id: item.cropId,
        members: {
          $elemMatch: { user: item.userId, identifier: item.identifier }
        }
      })
      let findUser = await UserRepository.findOne({ _id: item.userId })
      let findCompany = await CompanyRepository.findOne({
        identifier: item.identifier
      })

      if (!findCrop) {
        this.logger.log(
          `Not found Crop with id ${item.cropId}, userId ${item.userId} and identifier ${item.identifier} `
        )
        continue
      }

      if (!findUser) {
        this.logger.log(
          `Not found Company with identifier ${item.identifier} or not found user with id ${item.userId}`
        )
        continue
      }

      const cropBackup = {
        cropId: findCrop._id,
        data: findCrop,
        type: 'crop'
      }
      const userBackup = {
        userId: findUser._id,
        data: findUser,
        type: 'user'
      }
      listBackup.push(cropBackup)
      listBackup.push(userBackup)

      await CropRepository.findOneAndUpdate(
        {
          _id: item.cropId,
          members: {
            $elemMatch: { user: item.userId, identifier: item.identifier }
          }
        },
        {
          $pull: {
            members: {
              user: item.userId,
              identifier: item.identifier
            }
          }
        }
      )

      if (findCompany) {
        await UserRepository.findOneAndUpdate(
          {
            _id: item.userId,
            companies: {
              $elemMatch: { company: findCompany._id }
            }
          },
          {
            $pull: {
              companies: {
                company: findCompany._id
              }
            }
          }
        )
      }
      if (!findCompany) {
        await UserRepository.findOneAndUpdate(
          {
            _id: item.userId,
            companies: {
              $elemMatch: { identifier: item.identifier }
            }
          },
          {
            $pull: {
              companies: {
                identifier: item.identifier
              }
            }
          }
        )
      }

      await createEventAuditUseCase.execute(
        findCrop._id,
        IEntity.CROP,
        EOperationTypeDataBase.UPDATE
      )

      await createEventAuditUseCase.execute(
        findCrop._id,
        IEntity.USER,
        EOperationTypeDataBase.UPDATE
      )

      i = this.processingProgressBar(i, deleteMemberCrop.length)
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
        await CropRepository.update({ _id: item.cropId }, { $set: item.data })
      }
      if (item.type === 'user') {
        await UserRepository.update({ _id: item.userId }, { $set: item.data })
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
