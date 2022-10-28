import { BaseCommand, flags } from '@adonisjs/core/build/standalone'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import mime from 'mime'
import * as crypto from 'crypto'
import Env from '@ioc:Adonis/Core/Env'
import { S3 } from '@ioc:Aws'
import {
  countRelationshipsPipelines,
  searchRelationshipsPipelines
} from 'App/Core/FileDocument/Infrastructure/Mongoose/PipeLines'
import { MongoClient, ObjectId } from 'mongodb'
import { DocumentOwnerEnum } from 'App/Core/FileDocument/Infrastructure/Mongoose/enum'
import FileDocumentRepository from 'App/Core/FileDocument/Infrastructure/Mongoose/Repositories'
import StorageRepository from 'App/Core/Storage'
import {
  ACL_PUBLIC_READ,
  API_CORE_PATH_BASE,
  AWS_PUBLIC_BUCKET_NAME,
  CONTENT_TYPE_APPLICATION_JSON,
  CONTENT_TYPE_BASE_64,
  DATABASE_URL
} from 'App/utils'
export default class UploadLocalFilesToS3 extends BaseCommand {
  /**
   * connection
   */
  private connection: MongoClient
  /**
   * fileDocumentRepository
   */

  /**
   * Command name is used to run the command
   */
  public static commandName = 'upload:local:files:to:s3'

  /**
   * Command description is displayed in the "help" output
   */
  public static description =
    'This command is to upload to s3 the files saved locally on the production server'

  @flags.boolean({ alias: 'r', description: 'Rollback flag' })
  public rollbackCommand: boolean

  @flags.boolean({ alias: 't', description: 'Test flag' })
  public testCommand: boolean

  private nameFileBackup: string = 'upload-local-files-to-s3.json'
  private s3: S3

  public static settings = {
    /**
     * Set the following value to true, if you want to load the application
     * before running the command. Don't forget to call `node ace generate:manifest`
     * afterwards.
     */
    loadApp: true,

    /**
     * Set the following value to true, if you want this command to keep running until
     * you manually decide to exit the process. Don't forget to call
     * `node ace generate:manifest` afterwards.
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
   * Execute method command.
   */
  private async execute(): Promise<void> {
    const filesBackup: Record<string, any>[] = []

    const errors: Record<string, any>[] = []
    let file
    let i: number = 0
    let countFiles = 0
    let countUpload = 0
    const results = await FileDocumentRepository.count(
      countRelationshipsPipelines
    )
    if (results.length) {
      countFiles = results[0].totals
    }
    if (!this.testCommand) {
      const match = {
        existsPath: { $ne: false }
      }
      //@ts-ignore
      countRelationshipsPipelines.unshift({ $match: match })
      //@ts-ignore
      searchRelationshipsPipelines.unshift({ $match: match })
    }
    const cursor = await FileDocumentRepository.findWithCursor(
      searchRelationshipsPipelines
    )
    while ((file = await cursor.next())) {
      //file.path
      let absolutePath = this.getAbsolutePath(file.path)
      let existsPath = existsSync(absolutePath)

      //file.pathIntermediate
      const absolutePathIntermediate = this.getAbsolutePath(
        file.pathIntermediate
      )
      const existsPathIntermediate = existsSync(absolutePathIntermediate)

      //file.pathThumbnails
      const absolutePathThumbnails = this.getAbsolutePath(file.pathThumbnails)
      const existsPathThumbnails = existsSync(absolutePathThumbnails)

      const isFileExists =
        existsPath || existsPathIntermediate || existsPathThumbnails
      await FileDocumentRepository.updateOne(
        { _id: file._id },
        { $set: { existsPath: isFileExists } }
      )
      if (!isFileExists) {
        errors.push({
          createdAt: new Date(),
          fileId: file._id,
          path: file.path,
          pathIntermediate: file.pathIntermediate,
          pathThumbnails: file.pathThumbnails,
          absolutePath,
          absolutePathIntermediate,
          absolutePathThumbnails,
          existsPath,
          existsPathIntermediate,
          existsPathThumbnails
        })
      }
      if (!isFileExists || this.testCommand) {
        i = this.processingProgressBar(i, countFiles)
        continue
      }

      let filePath = file.path
      if (!existsPath && existsPathIntermediate) {
        existsPath = true
        absolutePath = absolutePathIntermediate
        filePath = file.pathIntermediate
      }

      if (!existsPath && existsPathThumbnails) {
        absolutePath = absolutePathThumbnails
        filePath = file.pathThumbnails
      }

      // @ts-ignore
      const mimetype = mime.getType(absolutePath)
      const isImage = /^image/.test(mimetype)
      const document = this.getDocumentOwner(file)
      const buffer = readFileSync(absolutePath)

      const { key, path } = await this.updateFilePath(
        filePath,
        document,
        mimetype,
        isImage,
        buffer
      )
      const { key: keyIntermediate, path: pathIntermediate } =
        await this.updateFilePath(
          file.pathIntermediate,
          document,
          mimetype,
          isImage
        )
      const { key: keyThumbnails, path: pathThumbnails } =
        await this.updateFilePath(
          file.pathThumbnails,
          document,
          mimetype,
          isImage
        )

      filesBackup.push({
        fileId: file._id,
        setData: {
          path: file.path,
          pathIntermediate: file.pathIntermediate,
          pathThumbnails: file.pathThumbnails,
          key: null,
          keyIntermediate: null,
          keyThumbnails: null,
          isPrivate: null
        }
      })

      const setData = {
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
        pathServer: file.path
      }
      await FileDocumentRepository.updateOne(
        { _id: file._id },
        { $set: setData }
      )
      await this.setCreatedAt(file._id)
      countUpload++
      i = this.processingProgressBar(i, countFiles)
    }

    await this.saveResults({
      countUpload,
      countFiles,
      countErrors: errors.length,
      errors
    })
    await StorageRepository.create(filesBackup, this.nameFileBackup)
  }

  /**
   * Set Timestamps.
   */
  private async setCreatedAt(_id) {
    if (!this.connection) {
      this.connection = await MongoClient.connect(Env.get(DATABASE_URL))
    }
    // @ts-ignore
    const db = this.connection.db(this.connection.s.options.dbName)
    const collection = db.collection(String('filedocuments'))
    await collection.updateOne(
      { _id: new ObjectId(_id) },
      { $set: { createdAt: _id.getTimestamp() } }
    )
  }
  /**
   * close Connection.
   */
  private async closeConnection() {
    if (this.connection) {
      await this.connection.close()
    }
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

    const key = `${document.directory}/${document._id}/${
      mimetype.split('/')[0]
    }/${this.getFileName(path)}`
    const response: S3.ManagedUpload.SendData = await this.uploadS3(
      key,
      buffer,
      mimetype,
      isImage ? CONTENT_TYPE_BASE_64 : '',
      isImage ? ACL_PUBLIC_READ : null
    )
    return {
      key: response.Key,
      path: isImage ? response.Location : null
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
  private getDocumentOwner(file): any {
    if (file.company) {
      return {
        _id: file.company._id,
        directory: DocumentOwnerEnum.COMPANIES
      }
    }

    if (file.activity) {
      return {
        _id: file.activity._id,
        directory: DocumentOwnerEnum.ACTIVITIES
      }
    }

    if (file.achievement) {
      return {
        _id: file.achievement._id,
        directory: DocumentOwnerEnum.ACHIEVEMENTS
      }
    }

    if (file.crop) {
      return {
        _id: file.crop._id,
        directory: DocumentOwnerEnum.CROPS
      }
    }

    if (file.approvalRegisterSignPdf) {
      return {
        _id: file.approvalRegisterSignPdf._id,
        directory: DocumentOwnerEnum.APPROVAL_REGISTER_SIGNS
      }
    }

    if (file.approvalRegisterSignOts) {
      return {
        _id: file.approvalRegisterSignOts._id,
        directory: DocumentOwnerEnum.APPROVAL_REGISTER_SIGNS
      }
    }

    return {
      _id: file._id,
      directory: DocumentOwnerEnum.FILES
    }
  }
  /**
   * Concat the absolute path of the api core with the file path.
   */
  private getAbsolutePath(path): string {
    if (/^public/.test(path)) {
      return `${Env.get(API_CORE_PATH_BASE)}/${path}`
    }
    if (/^uploads/.test(path)) {
      return `${Env.get(API_CORE_PATH_BASE)}/public/${path}`
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
      this.logger.info(`countFiles: ${result.countFiles}`)
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
    const files = await StorageRepository.get(this.nameFileBackup)
    for (const item of files) {
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

      await FileDocumentRepository.updateOne(
        { _id: item.fileId },
        { $set: item.setData, $unset: { existsPath: '', pathServer: '' } }
      )
      i = this.processingProgressBar(i, files.length)
    }
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
      await this.closeConnection()
    } catch (error) {
      this.logger.error(`Error Message: ${error.message}`)
      this.logger.error(`Error: ${error}`)
    }
  }
}
