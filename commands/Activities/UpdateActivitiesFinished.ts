import { BaseCommand, flags } from '@adonisjs/core/build/standalone'
import StorageRepository from 'App/Core/Storage'
import { existsSync } from 'fs'
import ActivityRepository from 'App/Core/Activity/Infrastructure/Mongoose/Repositories'
import CropRepository from 'App/Core/Crop/Infrastructure/Mongoose/Repositories'
import ApprovalRegisterSignRepository from 'App/Core/ApprovalRegisterSign/Infrastructure/Mongoose/Repositories'
import { createEventAuditUseCase } from 'App/Core/EventsAuditEntities/Infrastructure/useCase'
import Aws from '@ioc:Aws'
import Env from '@ioc:Adonis/Core/Env'
import BlockChainServices from 'App/utils/BlockChainService'
import { FileService } from 'App/Core/FileDocument/Services/FileService'
import { ApprovalRegisterSign } from 'App/Core/ApprovalRegisterSign/Infrastructure/Mongoose/Interfaces'
import { FileDocumentApproval } from 'App/Core/ApprovalRegisterSign/Infrastructure/Mongoose/Interfaces/ApprovalRegisterSign.interface'
import { API_CORE_PATH_BASE } from 'App/utils'
import { statusActivities } from 'App/utils/status'
import {
  EOperationTypeDataBase,
  IEntity
} from 'App/Core/EventsAuditEntities/Infrastructure/Mongoose/Interfaces/EventsAuditEntities.interface'
export default class UpdateActivitiesFinished extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'update:activities:finished'

  /**
   * Command description is displayed in the "help" output
   */
  public static description = 'This command update activities to finished'

  @flags.boolean({ alias: 'r', description: 'Rollback flag' })
  public rollbackCommand: boolean

  private nameFileBackup: string = 'update-activities-finished.json'
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
    this.logger.success('Started update activities to finished')
    try {
      if (this.rollbackCommand) {
        this.logger.success('Started rollback update activities to finished')
        await this.rollback()
      } else {
        await this.execute()
      }
    } catch (error) {
      this.logger.error(`Error Message: ${error.message}`)
      this.logger.error(`Error: ${error}`)
    }
    this.logger.logUpdatePersist()
    this.logger.success('Update activities to finished Success')
  }

  public async execute(): Promise<void> {
    let i: number = 0
    let listBackup: Array<Object> = []
    let existsPath: boolean = false
    let errorsActivityIds: any = []

    const key = await this.prompt.ask('Enter the key', {
      validate: this.validate
    })

    let data = await this.getFile(Env.get('AWS_PUBLIC_BUCKET_NAME'), key)
    let activitiesFinished = JSON.parse(data.body.toString('utf-8'))

    for (const item of activitiesFinished) {
      let activity = await ActivityRepository.findOnePopulate({
        _id: item.idActivity
      })

      if (activity && activity.status[0].name.en === 'DONE') {
        let fileNotExist = 0
        const isCompleteSigned = await this.isCompleteSingers(activity)

        if (isCompleteSigned) {
          const evidenceAchievements = activity.achievements.flatMap(
            (achievement) => achievement.files
          )
          const files = activity.files.concat(evidenceAchievements)

          for (const file of files) {
            if (/^https/.test(file.path)) {
              continue
            }

            const absolutePath = this.getAbsolutePath(file.path)
            existsPath = existsSync(absolutePath)
            if (!existsPath) {
              const absolutePath = this.getAbsolutePath(file.pathServer)
              existsPath = existsSync(absolutePath)
            }
            if (!existsPath) {
              const absolutePath = this.getAbsolutePath(file.key)
              existsPath = existsSync(absolutePath)
            }
            if (!existsPath) {
              fileNotExist++
            }
          }

          if (fileNotExist > 0) {
            errorsActivityIds.push(activity._id)
            i = this.processingProgressBar(i, activitiesFinished.length)
            continue
          }
          const crop: any = await CropRepository.findOneWithCropType({
            _id: item.idCrop
          })
          const { ots, hash, pathPdf, nameFilePdf, nameFileOts, pathOtsFile } =
            await BlockChainServices.sign(crop, activity)

          const approvalRegisterSign = await this.create({
            ots,
            hash,
            pathPdf,
            nameFilePdf,
            nameFileOts,
            pathOtsFile,
            activity
          })

          activity.approvalRegister = approvalRegisterSign._id
          listBackup.push({
            actityId: activity._id,
            approvalId: approvalRegisterSign.id,
            status: activity.status
          })

          await this.changeStatus(activity, 'FINISHED')
          await this.removeActivities(activity, crop, 'done')
          await this.addActivities(activity, crop)
          await createEventAuditUseCase.execute(
            activity._id,
            IEntity.ACTIVITY,
            EOperationTypeDataBase.UPDATE
          )
          await createEventAuditUseCase.execute(
            crop._id,
            IEntity.CROP,
            EOperationTypeDataBase.UPDATE
          )
          await createEventAuditUseCase.execute(
            approvalRegisterSign._id,
            IEntity.APPROVALREGISTERSIGNS,
            EOperationTypeDataBase.CREATE
          )
        }
      }

      i = this.processingProgressBar(i, activitiesFinished.length)
    }

    this.logger.info(`error path in activity: ${errorsActivityIds}`)

    await StorageRepository.create(listBackup, this.nameFileBackup)
  }

  private async changeStatus(activity, status: string) {
    const statusChanged = statusActivities(status)

    activity.status = statusChanged

    return activity.save()
  }

  public async removeActivities(activity, crop, statusCrop = 'pending') {
    crop[statusCrop].pull(activity._id)

    return crop.save()
  }

  public addActivities(activity, crop) {
    const status = activitiesStatus.find(
      (item) => item.name === activity.status[0].name.en
    )

    const statusCrop = status.cropStatus
    if (!this.isExistActivity(activity, crop, statusCrop)) {
      crop[statusCrop].push(activity._id)
    }

    return crop.save()
  }

  public isExistActivity(activity, crop, status: string): boolean {
    if (
      crop[status].find(
        (item) => item._id.toString() === activity._id.toString()
      )
    ) {
      return true
    }

    return false
  }

  /**
   * Rollback Command
   */
  public async rollback(): Promise<void> {
    let i: number = 0
    const data = await StorageRepository.get(this.nameFileBackup)
    for (const item of data) {
      await ActivityRepository.update(
        { _id: item.actityId },
        { $set: { status: item.status } }
      )
      await ApprovalRegisterSignRepository.deleteOne({ _id: item.approvalId })
      i = this.processingProgressBar(i, data.length)
    }
  }

  private async isCompleteSingers(activity) {
    const signers = activity.signers.filter((item) => !item.signed)

    if (signers.length > 0) {
      return false
    }

    return true
  }

  public async create(data: ApprovalRegisterSign) {
    const fileDocumentPdf: any = await this.createFile({
      nameFile: data.nameFilePdf,
      path: data.pathPdf,
      date: new Date(),
      activityId: data.activity._id.toString()
    })

    const fileDocumentOts: any = await this.createFile({
      nameFile: data.nameFileOts,
      path: data.pathOtsFile,
      date: new Date(),
      activityId: data.activity._id.toString()
    })

    return ApprovalRegisterSignRepository.create({
      ots: data.ots,
      hash: data.hash,
      activity: data.activity._id,
      filePdf: fileDocumentPdf._id,
      fileOts: fileDocumentOts._id
    })
  }

  /**
   *
   * @param dataFile
   */
  private async createFile(dataFile: FileDocumentApproval) {
    const data = await StorageRepository.getPath(dataFile.nameFile)
    let newFile = await FileService.createFilePrivate(
      data,
      dataFile.activityId!,
      `activities`
    )
    return newFile
  }

  /**
   * Concat the absolute path of the api core with the file path.
   */
  private getAbsolutePath(path): string {
    if (/^public/.test(path)) {
      return `${Env.get(API_CORE_PATH_BASE)}${path}`
    }
    if (/uploads/.test(path)) {
      return `${Env.get(API_CORE_PATH_BASE)}/public/${path}`
    }
    if (/uploads/.test(path)) {
      return `${Env.get(API_CORE_PATH_BASE)}/public/uploads/${path}`
    }
    if (/activities/.test(path)) {
      return `${Env.get(API_CORE_PATH_BASE)}/public/uploads/${path}`
    }
    return `/${path}`
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

const activitiesStatus: Array<any> = [
  {
    name: 'TO_COMPLETE',
    cropStatus: 'pending'
  },
  {
    name: 'PLANNED',
    cropStatus: 'toMake'
  },
  {
    name: 'DONE',
    cropStatus: 'done'
  },
  {
    name: 'FINISHED',
    cropStatus: 'finished'
  },
  {
    name: 'EXPIRED',
    cropStatus: 'toMake'
  }
]
