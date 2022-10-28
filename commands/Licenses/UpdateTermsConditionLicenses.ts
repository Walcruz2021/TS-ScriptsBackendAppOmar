import { BaseCommand, flags } from '@adonisjs/core/build/standalone'
import LicenseRepository from 'App/Core/License/Infrastructure/Mongoose/Repositories'
import StorageRepository from 'App/Core/Storage'
import Aws from '@ioc:Aws'
import Env from '@ioc:Adonis/Core/Env'
import { createEventAuditUseCase } from 'App/Core/EventsAuditEntities/Infrastructure/useCase'
import {
  EOperationTypeDataBase,
  IEntity
} from 'App/Core/EventsAuditEntities/Infrastructure/Mongoose/Interfaces/EventsAuditEntities.interface'
import { existsSyncUtil } from 'App/utils/utils'
import { createFilePrivateUseCase } from 'App/Core/FileDocument/useCase'
export default class UpdateTermsConditionLicenses extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'update:termsCondition:licenses'

  /**
   * Command description is displayed in the "help" output
   */
  public static description = 'This command update termsCondition licences'

  private nameFileBackup: string = 'update-termsCondition-licenses.json'

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
    this.logger.success('Started update termsCondition licences')
    try {
      if (this.rollbackCommand) {
        this.logger.success('Started rollback update termsCondition licences')
        await this.rollback()
      } else {
        await this.execute()
      }
    } catch (error) {
      this.logger.error(`Error Message: ${error.message}`)
      this.logger.error(`Error: ${error}`)
    }
    this.logger.logUpdatePersist()
    this.logger.success('Update termsCondition licences Success')
  }

  public async execute(): Promise<void> {
    let i: number = 0
    let listBackup: Array<Object> = []
    const directory = 'licenses'
    const key = await this.prompt.ask('Enter the key', {
      validate: this.validate
    })

    let data = await this.getFile(Env.get('AWS_PUBLIC_BUCKET_NAME'), key)
    let UpdateTermsConditionLicenses = JSON.parse(data.body.toString('utf-8'))

    for (const item of UpdateTermsConditionLicenses) {
      let findLicense = await LicenseRepository.findOne({
        _id: item.idLicense
      })

      if (!findLicense) {
        console.log(`License not found for id: ${item.idLicense}`)
        continue
      }

      const termsAndConditionsName = item.termsAndConditions.trim()
      const templatePath = `${process.cwd()}/dataset/resources/licencias_templates/${termsAndConditionsName}`

      if (!existsSyncUtil(templatePath)) {
        console.log(
          `No pudimos encontrar el template <${termsAndConditionsName}> `
        )
        continue
      }

      const licenseBackup = {
        idLicense: findLicense._id,
        data: findLicense
      }
      listBackup.push(licenseBackup)

      const fileResponse = await createFilePrivateUseCase.execute({
        filePath: templatePath,
        directory,
        entityId: String(findLicense._id)
      })

      const file = fileResponse.value

      if (fileResponse.isLeft()) {
        console.log(
          `No puimos cargar el template a la licencia <${findLicense.name}>.`
        )
        continue
      }

      const termsAndConditionsTemplate = file.getValue()

      await LicenseRepository.findOneAndUpdate(
        { _id: findLicense._id },
        { termsAndConditionsTemplate: termsAndConditionsTemplate }
      )

      await createEventAuditUseCase.execute(
        findLicense._id,
        IEntity.LICENSE,
        EOperationTypeDataBase.UPDATE
      )

      i = this.processingProgressBar(i, UpdateTermsConditionLicenses.length)
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
      await LicenseRepository.update(
        { _id: item.idLicense },
        { $set: item.data }
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
