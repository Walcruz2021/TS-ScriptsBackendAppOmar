import { BaseCommand, flags } from '@adonisjs/core/build/standalone'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import mime from 'mime'
import * as crypto from 'crypto'
import Env from '@ioc:Adonis/Core/Env'
import { S3 } from '@ioc:Aws'
import { DocumentOwnerEnum } from 'App/Core/FileDocument/Infrastructure/Mongoose/enum'
import FileDocumentRepository from 'App/Core/FileDocument/Infrastructure/Mongoose/Repositories'
import {
  ACL_PUBLIC_READ,
  API_CORE_PATH_BASE,
  AWS_PUBLIC_BUCKET_NAME,
  CONTENT_TYPE_APPLICATION_JSON,
  CONTENT_TYPE_BASE_64
} from 'App/utils'
import LotRepository from 'App/Core/Lot/Infrastructure/Mongoose/Repositories'
import { FileDocument } from 'App/Core/FileDocument/Infrastructure/Mongoose/Interfaces'
import { createEventAuditUseCase } from 'App/Core/EventsAuditEntities/Infrastructure/useCase'
import {
  EOperationTypeDataBase,
  IEntity
} from 'App/Core/EventsAuditEntities/Infrastructure/Mongoose/Interfaces/EventsAuditEntities.interface'
import StorageRepository from 'App/Core/Storage'
export default class AddImagesLotsToS3 extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'add:images:lots:to:s3'

  /**
   * Command description is displayed in the "help" output
   */
  public static description =
    'This command is to upload to s3 the lots images saved locally'

  @flags.boolean({ alias: 'r', description: 'Rollback flag' })
  public rollbackCommand: boolean

  @flags.boolean({ alias: 't', description: 'Test flag' })
  public testCommand: boolean

  private nameFileBackup: string = 'upload-local-files-to-s3.json'
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

  private getProgressBar(currentPercentage: number) {
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
   * @returns
   */
  private processingProgressBar(index: number, limit: number): number {
    if (index < limit) {
      index++
      const currentPercentage = Number(((index * 100) / limit).toFixed(2))
      this.logger.logUpdate(
        `Processing: ${this.getProgressBar(
          currentPercentage
        )} ${currentPercentage}% | ${index}/${limit}`
      )
    }
    return index
  }

  /**
   * Set Repositories to use command.
   */
  private async setRepositories(): Promise<void> {
    this.s3 = new S3()
  }

  /**
   * Run command
   */
  public async run() {
    await this.setRepositories()
    this.logger.success('Started upload local files to s3')
    try {
      if (this.rollbackCommand) {
        await this.rollback()
      } else {
        if (this.testCommand) {
          this.logger.info('Run mode Test')
        }
        await this.execute()
        this.logger.logUpdatePersist()
        this.logger.success('Upload local files to s3 Success')
      }
    } catch (error) {
      this.logger.error(`Error Message: ${error.message}`)
      this.logger.error(`Error: ${error}`)
    }
  }

  /**
   * Execute method command.
   */
  private async execute(): Promise<void> {
    const lotsBackup: Record<string, any>[] = []

    const errors: Record<string, any>[] = []
    let i: number = 0

    let countUpload = 0
    const lots = await LotRepository.findAll({
      'image.file': null,
      image: { $ne: null }
    })
    let countLots = lots.length
    for (const lot of lots) {
      if (lot.image.normal) {
        const absolutePath = this.getAbsolutePath(lot.image.normal)
        const existsPath = existsSync(absolutePath)
        if (!existsPath) {
          errors.push({
            createdAt: new Date(),
            fileId: lot._id,
            path: lot.image.normal,
            absolutePath,
            existsPath
          })
        }
        if (!existsPath || this.testCommand) {
          i = this.processingProgressBar(i, lots.length)
          continue
        }
        // @ts-ignore
        const mimetype = mime.getType(absolutePath)
        const isImage = /^image/.test(mimetype)
        const document = this.getDocumentOwner(lot)
        const buffer = readFileSync(absolutePath)

        const { key, path, name } = await this.updateFilePath(
          lot.image.normal,
          document,
          mimetype,
          isImage,
          buffer
        )
        const { key: keyIntermediate, path: pathIntermediate } =
          await this.updateFilePath(
            lot.image.normal,
            document,
            mimetype,
            isImage
          )
        const { key: keyThumbnails, path: pathThumbnails } =
          await this.updateFilePath(
            lot.image.normal,
            document,
            mimetype,
            isImage
          )

        const fileDocumentDto: FileDocument = {
          mimetype,
          codeMd5: crypto
            .createHash('md5')
            .update(buffer.toString('hex'))
            .digest('hex'),
          size: buffer.byteLength,
          key,
          path,
          keyIntermediate,
          pathIntermediate,
          keyThumbnails,
          pathThumbnails,
          isPrivate: !isImage,
          pathServer: lot.image.normal,
          nameFile: name
        }

        const fileDocument = await FileDocumentRepository.create(
          fileDocumentDto
        )

        lotsBackup.push({
          lotId: lot._id,
          normal: lot.image.normal,
          fileId: fileDocument._id
        })

        await LotRepository.updateOne(
          { _id: lot._id },
          {
            $set: {
              'image.normal': fileDocument.path,
              'image.normalLegacy': lot.image.normal,
              'image.file': fileDocument._id
            }
          }
        )

        await createEventAuditUseCase.execute(
          lot._id,
          IEntity.LOT,
          EOperationTypeDataBase.UPDATE
        )
        await createEventAuditUseCase.execute(
          fileDocument._id,
          IEntity.FILE,
          EOperationTypeDataBase.CREATE
        )

        countUpload++
      }
      i = this.processingProgressBar(i, countLots)
    }

    await this.saveResults({
      countUpload,
      countLots,
      countErrors: errors.length,
      errors
    })
    await StorageRepository.create(lotsBackup, this.nameFileBackup)
  }

  /**
   * Upload to s3 according to the path of the referred file.
   */
  private async updateFilePath(
    path,
    document,
    mimetype,
    isImage,
    buffer?
  ): Promise<any> {
    const absolutePath = this.getAbsolutePath(path)
    const existsPath = existsSync(absolutePath)
    if (!existsPath) {
      return {
        key: null,
        path: null
      }
    }
    if (!buffer) {
      buffer = readFileSync(absolutePath)
    }

    let name = this.getFileName(path)

    const key = `${document.directory}/${document._id}/${
      mimetype.split('/')[0]
    }/${name}`
    const response: S3.ManagedUpload.SendData = await this.uploadS3(
      key,
      buffer,
      mimetype,
      isImage ? CONTENT_TYPE_BASE_64 : '',
      isImage ? ACL_PUBLIC_READ : null
    )
    return {
      key: response.Key,
      path: isImage ? response.Location : null,
      name: name
    }
  }

  /**
   * Take the name of the file in the path.
   */
  private getFileName(path): string {
    const fileNameParts = path.split('/')
    const fileName = String(fileNameParts[fileNameParts.length - 1])
    return `file-${Date.now()}-${fileName}`
  }

  /**
   * Look for the referred document owner of the file.
   */
  private getDocumentOwner(lot): any {
    return {
      _id: lot._id,
      directory: DocumentOwnerEnum.LOTS
    }
  }
  /**
   * Concat the absolute path of the api core with the file path.
   */
  private getAbsolutePath(path): string {
    if (/^public/.test(path)) {
      return `${Env.get(API_CORE_PATH_BASE)}${path}`
    }
    if (/uploads/.test(path)) {
      return `${Env.get(API_CORE_PATH_BASE)}/public${path}`
    }
    return `/${path}`
  }

  /**
   * Save the results of the command run.
   */
  private async saveResults(result): Promise<void> {
    try {
      const currentTime = new Date().getTime()
      const dataJSON = JSON.stringify(
        {
          currentTime: new Date(currentTime),
          ...result
        },
        null,
        2
      )
      const filePath = `${process.cwd()}/tmp/results_${currentTime}.json`
      writeFileSync(filePath, dataJSON, 'utf-8')
      const response: S3.ManagedUpload.SendData = await this.uploadS3(
        `results/${currentTime}`,
        readFileSync(filePath),
        CONTENT_TYPE_APPLICATION_JSON,
        '',
        ACL_PUBLIC_READ
      )
      this.logger.info(`currentTime: ${new Date(currentTime)}`)
      this.logger.info(`countUpload: ${result.countUpload}`)
      this.logger.info(`countErrors: ${result.countErrors}`)
      this.logger.info(`url: ${response.Location}`)
    } catch (err) {
      this.logger.error(err.message)
    }
  }
  /**
   * Upload the file to s3.
   */
  private async uploadS3(
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

  /**
   * Remove the file to s3.
   */
  private async deleteS3(Key: string): Promise<void> {
    try {
      const params: S3.PutObjectRequest = {
        Bucket: Env.get(AWS_PUBLIC_BUCKET_NAME),
        Key
      }
      await this.s3.deleteObject(params).promise()
    } catch (e) {}
  }

  /**
   * Rollback command
   */
  private async rollback(): Promise<void> {
    let i: number = 0
    const lots = await StorageRepository.get(this.nameFileBackup)
    for (const item of lots) {
      const file = await FileDocumentRepository.findOne({ _id: item.fileId })

      if (file.key) {
        await this.deleteS3(file.key)
      }
      if (file.keyIntermediate) {
        await this.deleteS3(file.keyIntermediate)
      }
      if (file.keyThumbnails) {
        await this.deleteS3(file.keyThumbnails)
      }

      await FileDocumentRepository.deleteOne({ _id: item.fileId })
      await LotRepository.updateOne(
        { _id: item.lotId._id },
        {
          $set: {
            'image.normal': item.normal
          },
          $unset: { 'image.normalLegacy': '', 'image.file': '' }
        }
      )
      i = this.processingProgressBar(i, lots.length)
    }
  }
}
