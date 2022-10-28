import { BaseCommand, flags } from '@adonisjs/core/build/standalone'
import StorageRepository from 'App/Core/Storage'
import Aws from '@ioc:Aws'
import Env from '@ioc:Adonis/Core/Env'
import { createEventAuditUseCase } from 'App/Core/EventsAuditEntities/Infrastructure/useCase'
import {
  EOperationTypeDataBase,
  IEntity
} from 'App/Core/EventsAuditEntities/Infrastructure/Mongoose/Interfaces/EventsAuditEntities.interface'
import ActivityRepository from 'App/Core/Activity/Infrastructure/Mongoose/Repositories'

export default class DeleteActivitySigner extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'delete:activity:signer'

  /**
   * Command description is displayed in the "help" output
   */
  public static description = 'This command delete activity signer'

  private nameFileBackup: string = 'delete-activity-signer.json'

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
    this.logger.success('Started delete activity signer')
    try {
      if (this.rollbackCommand) {
        this.logger.success('Started rollback delete activity signer')
        await this.rollback()
      } else {
        await this.execute()
      }
    } catch (error) {
      this.logger.error(`Error Message: ${error.message}`)
      this.logger.error(`Error: ${error}`)
    }
    this.logger.logUpdatePersist()
    this.logger.success('Delete activity signer Success')
  }

  public async execute(): Promise<void> {
    let i: number = 0
    let listBackup: Array<Object> = []
    const key = await this.prompt.ask('Enter the key', {
      validate: this.validate
    })

    let data = await this.getFile(Env.get('AWS_PUBLIC_BUCKET_NAME'), key)
    let signers = JSON.parse(data.body.toString('utf-8'))

    for (const item of signers) {
      let findActivity = await ActivityRepository.findOne({
        _id: item.id_activity
      })

      let signer = await findActivity?.signers.find(
        (signer) => signer._id?.toString() === item._id
      )
      if (findActivity && signer) {
        const activitySignerBackup = {
          activityId: findActivity._id,
          dataSigner: signer
        }
        listBackup.push(activitySignerBackup)

        await ActivityRepository.findOneAndUpdate(
          {
            _id: item.id_activity
          },
          {
            $pull: {
              signers: {
                _id: item._id
              }
            }
          }
        )
        await createEventAuditUseCase.execute(
          findActivity._id,
          IEntity.ACTIVITY,
          EOperationTypeDataBase.UPDATE
        )
      }
      i = this.processingProgressBar(i, signers.length)
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
      await ActivityRepository.findOneAndUpdate(
        { _id: item.activityId },
        { $push: { signers: item.dataSigner } }
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
