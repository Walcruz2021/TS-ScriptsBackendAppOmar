import { BaseCommand, flags } from '@adonisjs/core/build/standalone'
import CropRepository from 'App/Core/Crop/Infrastructure/Mongoose/Repositories'
import CompanyRepository from 'App/Core/Company/Infrastructure/Mongoose/Repositories'
import ActivityTypeRepository from 'App/Core/ActivityType/Infrastructure/Mongoose/Repositories'
import { TypeActivity } from 'App/utils/crops.enum'
import { IValidateLotInActivityHarvest } from 'App/Core/Activity/Infrastructure/Mongoose/Interfaces/Activity.aux.interface'
import moment from 'moment'
import { updateLots } from 'App/Core/Lot/utils'
import { readFileSync, writeFileSync, unlinkSync } from 'fs'
import { S3 } from '@ioc:Aws'
import Env from '@ioc:Adonis/Core/Env'
import {
  ACL_PUBLIC_READ,
  AWS_PUBLIC_BUCKET_NAME,
  CONTENT_TYPE_APPLICATION_JSON
} from 'App/utils'
import { IFileLogLotInterface } from 'App/Core/FilelogLot/Infrastructure/Interfaces/FileLogLot.interface'
import FileLogLotRepository from 'App/Core/FilelogLot/Infrastructure/Mongoose/Repositories'

export default class UpdateStatusLot extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'update:status:lot'

  /**
   * Command description is displayed in the "help" output
   */
  public static description = 'This command add timestamps in crops'
  @flags.boolean({ alias: 'r', description: 'Rollback flag' })
  public rollbackCommand: boolean

  @flags.boolean({ alias: 's', description: 'Show loading bar processing' })
  public showProgress: boolean
  private s3: S3

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
    this.logger.success('Started add timestamps crops')
    try {
      this.s3 = new S3()
      await this.execute()
    } catch (error) {
      this.logger.error(`Error Message: ${error.message}`)
      this.logger.error(`Error: ${error}`)
    }
    this.logger.logUpdatePersist()
    this.logger.success('Execution update crops Success')
  }
  public async execute(): Promise<void> {
    let company
    let i = 0
    let count = 0
    const dateNow = new Date()
    const cursor = await CompanyRepository.findByCursor({})
    count = await CompanyRepository.count({})
    let dataSent: any = []
    while ((company = await cursor.next())) {
      const crops = await CropRepository.findAll(
        { identifier: company.identifier },
        [{ path: 'lots.data' }, { path: 'finished' }]
      )
      for (const crop of crops) {
        const lotsIdsList = crop.lots
          .flatMap((item) => item.data)
          .filter((lot) => !lot.available)
          .map((lot) => {
            return { id: lot._id, uuid: lot.uuid || undefined }
          })
        const activitiesHarvest = (
          await this.getActivitiesWithTypeActivity(crop.finished)
        ).filter(
          // @ts-ignore
          (activity) => activity.type.tag === TypeActivity.Harvest
        )
        const idsToUpdate = lotsIdsList
          .map((idsLot) => {
            const isToAvailable = this.validateLotIsAvailable({
              activities: activitiesHarvest,
              lotId: idsLot.id,
              currentDate: dateNow,
              dateHarvest: crop.dateHarvest
            } as IValidateLotInActivityHarvest)
            if (isToAvailable || crop.cancelled)
              return { objectId: idsLot.id, uuid: idsLot.uuid, status: true }
          })
          .filter((el) => el !== undefined)

        if (idsToUpdate.length) {
          const res = await updateLots(idsToUpdate)
          // @ts-ignore
          dataSent.push({ data: idsToUpdate, is_error: !res })
        }
      }

      if (this.showProgress) {
        i = this.processingProgressBar(i, count)
      }
    }
    if (dataSent.length) {
      await this.writeLogRequest(dataSent)
    }
  }

  private async getActivitiesWithTypeActivity(activities) {
    const promiseActivities = activities.map(async (activity) => {
      const activityType = await ActivityTypeRepository.findOne({
        _id: activity.type
      })
      return {
        ...activity.toJSON(),
        type: activityType
      }
    })

    return Promise.all(promiseActivities)
  }

  private validateLotIsAvailable(args: IValidateLotInActivityHarvest): boolean {
    const { activities, lotId, currentDate, dateHarvest } = args
    let isToUpdate = false

    const activity = activities.find((activity) =>
      activity.lots.map((lot) => lot.toString()).includes(lotId.toString())
    )

    if (activity) {
      isToUpdate = moment(activity?.dateHarvest).isBefore(currentDate)
    } else {
      isToUpdate = moment(dateHarvest).isBefore(currentDate)
    }

    return isToUpdate
  }

  private async writeLogRequest(data): Promise<void> {
    const currentTime = new Date().getTime()
    const nameFile = `logs_${currentTime}`
    const filePath = `${process.cwd()}/tmp/${nameFile}.json`
    writeFileSync(filePath, JSON.stringify(data), 'utf-8')

    const response: S3.ManagedUpload.SendData = await this.saveFile(
      `logs/${currentTime}`,
      readFileSync(filePath),
      CONTENT_TYPE_APPLICATION_JSON,
      '',
      ACL_PUBLIC_READ
    )
    this.logger.info(`currentTime: ${new Date(currentTime)}`)
    this.logger.info(`url: ${response.Location}`)
    this.logger.info(`response: ${JSON.stringify(response)}`)
    const { Location, Key, Bucket } = response
    const fileLogLot: IFileLogLotInterface = {
      name: nameFile,
      dateExecution: new Date(),
      bucket: Bucket,
      locationS3: Location,
      key: Key
    }
    await FileLogLotRepository.save(fileLogLot)
    unlinkSync(filePath)
  }
  public async saveFile(
    Key: string,
    Body: S3.Body,
    ContentType: string,
    ContentEncoding?: string,
    ACL?: string | any
  ): Promise<S3.ManagedUpload.SendData> {
    const params: S3.PutObjectRequest = {
      Bucket: Env.get(AWS_PUBLIC_BUCKET_NAME),
      Body,
      ContentType,
      ContentEncoding: ContentEncoding ?? '',
      Key
    }
    if (ACL) {
      params['ACL'] = ACL
    }

    return this.s3.upload(params).promise()
  }
}
