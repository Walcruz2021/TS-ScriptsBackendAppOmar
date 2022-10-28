import { BaseCommand, flags } from '@adonisjs/core/build/standalone'
import StorageRepository from 'App/Core/Storage'
import Aws from '@ioc:Aws'
import Env from '@ioc:Adonis/Core/Env'
import { createEventAuditUseCase } from 'App/Core/EventsAuditEntities/Infrastructure/useCase'
import {
  EOperationTypeDataBase,
  IEntity
} from 'App/Core/EventsAuditEntities/Infrastructure/Mongoose/Interfaces/EventsAuditEntities.interface'
import LicenseRepository from 'App/Core/License/Infrastructure/Mongoose/Repositories'
import SignedLicenseRepository from 'App/Core/SignedLicenses/Infrastructure/Mongoose/Repositories'
import SubLicenseRepository from 'App/Core/SubLicense/Infrastructure/Mongoose/Repositories'
import { uploadFromS3Images } from 'App/utils/uploadFiles'
import { updateLicensesData } from './../../dataset/updateLicensesTestData'
import CompanyRepository from 'App/Core/Company/Infrastructure/Mongoose/Repositories'

export default class UpdateLicenses extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'update:licenses'

  /**
   * Command description is displayed in the "help" output
   */
  public static description = 'This command update licenses'

  private licenseBackup: string = 'update-license.json'
  private subLicenseBackup: string = 'update-subLicense.json'

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
    this.logger.success('Started update licenses')
    try {
      if (this.rollbackCommand) {
        this.logger.success('Started rollback update licenses')
        await this.rollback()
      } else {
        await this.execute()
      }
    } catch (error) {
      this.logger.error(`Error Message: ${error.message}`)
      this.logger.error(`Error: ${error}`)
    }
    this.logger.logUpdatePersist()
    this.logger.success('Update licenses Success')
  }

  public async execute(): Promise<void> {
    let i: number = 0
    let j: number = 0
    let listBackupLicense: Array<Object> = []
    let listBackupSubLicense: Array<Object> = []
    // const key = await this.prompt.ask('Enter the key', {
    //   validate: this.validate
    // })

    // let data = await this.getFile(Env.get('AWS_PUBLIC_BUCKET_NAME'), key)
    // let updateLicenses = JSON.parse(data.body.toString('utf-8'))

    if (updateLicensesData.Licenses && updateLicensesData.Licenses.length > 0) {
      for (const item of updateLicensesData.Licenses) {
        let findLicense = await LicenseRepository.findOne({
          idLicense: item.idLicense
        })
        if (findLicense) {
          const licenseBackup = {
            licenseId: findLicense._id,
            data: findLicense
          }
          listBackupLicense.push(licenseBackup)
          // if (item.name) {
          //   licensesBackup.name = findLicense.name
          //   findLicense.name = item.name
          // }

          if (item.image) {
            let dataImage = await this.getFile(
              Env.get('AWS_PUBLIC_BUCKET_NAME'),
              `commands/license/images/${item.image}`
            )
            let image = dataImage.body
            if (image) {
              const directory = 'licenses'
              const { imageOriginal, imageThumbnail, imageIntermediate } =
                await uploadFromS3Images(
                  findLicense._id,
                  directory,
                  item.image,
                  image
                )

              imageOriginal
                ? (findLicense.imageOriginal = imageOriginal)
                : findLicense.imageOriginal
              imageThumbnail
                ? (findLicense.imageThumbnail = imageThumbnail)
                : findLicense.imageThumbnail
              imageIntermediate
                ? (findLicense.imageIntermediate = imageIntermediate)
                : findLicense.imageIntermediate
            } else {
              console.log(
                `Image not found: ${item.image} for license ${item.idLicense}`
              )
              continue
            }
          }

          if (item.allowIntersection) {
            let checkSign = await SignedLicenseRepository.findOne({
              licenseId: findLicense._id
            })
            if (checkSign) {
              console.log(`Already Sign for license ${item.idLicense}`)
              continue
            } else {
              findLicense.allowIntersection = item.allowIntersection
            }
          }

          item.name ? (findLicense.name = item.name) : findLicense.name

          item.type ? (findLicense.type = item.type) : findLicense.type

          item.previewDescription
            ? (findLicense.previewDescription = item.previewDescription)
            : findLicense.previewDescription

          if (
            item.accessibleIdentifier &&
            item.accessibleIdentifier.length > 0
          ) {
            let accessibleIdentifier: any[] = []
            let identifierErrors: any[] = []

            const companiesInDB = await CompanyRepository.findAll({
              identifier: { $in: item.accessibleIdentifier }
            })

            for (const identifier of item.accessibleIdentifier) {
              const company = await companiesInDB.find(
                (company) => identifier === company.identifier
              )
              if (!company) {
                identifierErrors.push(
                  `La empresa con identifier <${identifier}> en accessibleIdentifier, no existe`
                )
                continue
              }
              accessibleIdentifier.push(String(company._id))
            }
            if (identifierErrors && identifierErrors.length > 0) {
              console.log(identifierErrors)
              continue
            }
            findLicense.accessibleIdentifier = accessibleIdentifier
          }

          if (
            item.inaccessibledentifier &&
            item.inaccessibledentifier.length > 0
          ) {
            let inaccessibleIdentifier: any[] = []
            let identifierErrors: any[] = []

            const companiesInDB = await CompanyRepository.findAll({
              identifier: { $in: item.inaccessibledentifier }
            })

            for (const identifier of item.inaccessibledentifier) {
              const company = await companiesInDB.find(
                (company) => identifier === company.identifier
              )
              if (!company) {
                identifierErrors.push(
                  `La empresa con identifier <${identifier}> en inaccessibleIdentifier, no existe`
                )
                continue
              }
              inaccessibleIdentifier.push(String(company._id))
            }
            if (identifierErrors && identifierErrors.length > 0) {
              console.log(identifierErrors)
              continue
            }
            findLicense.inaccessibleIdentifier = inaccessibleIdentifier
          }

          item.startDatePost
            ? (findLicense.startDatePost = item.startDatePost)
            : findLicense.startDatePost

          if (item.endDatePost) {
            if (item.endDatePost > findLicense.startDatePost) {
              findLicense.endDatePost = item.endDatePost
            } else {
              console.log(
                `EndDatePost not meet condition for license ${item.idLicense}`
              )
              continue
            }
          }

          if (item.startDate) {
            if (item.startDate >= findLicense.startDatePost) {
              findLicense.startDate = item.startDate
            } else {
              console.log(
                `StartDate not meet condition for license ${item.idLicense}`
              )
              continue
            }
          }

          if (item.endDate) {
            if (
              item.endDate > item.startDatePost &&
              item.endDate <= item.endDatePost
            ) {
              findLicense.endDate = item.endDate
            } else {
              console.log(
                `EndDate not meet condition for license ${item.idLicense}`
              )
              continue
            }
          }

          item.companyUsers
            ? (findLicense.companyUsers = item.companyUsers)
            : findLicense.companyUsers

          item.status ? (findLicense.status = item.status) : findLicense.status

          item.hectareLimit
            ? (findLicense.hectareLimit = item.hectareLimit)
            : findLicense.hectareLimit

          item.hectareLimitIdentifier
            ? (findLicense.hectareLimitIdentifier = item.hectareLimitIdentifier)
            : findLicense.hectareLimitIdentifier

          item.hectareMinIdentifier
            ? (findLicense.hectareMinIdentifier = item.hectareMinIdentifier)
            : findLicense.hectareMinIdentifier

          item.timeLeftPost
            ? (findLicense.timeLeftPost = item.timeLeftPost)
            : findLicense.timeLeftPost

          item.timeLeftNew
            ? (findLicense.timeLeftNew = item.timeLeftNew)
            : findLicense.timeLeftNew

          item.hectareLeftPercentage
            ? (findLicense.hectareLeftPercentage = item.hectareLeftPercentage)
            : findLicense.hectareLeftPercentage

          item.verificationType
            ? (findLicense.verificationType = item.verificationType)
            : findLicense.verificationType

          await findLicense.save()

          await createEventAuditUseCase.execute(
            findLicense._id,
            IEntity.LICENSE,
            EOperationTypeDataBase.UPDATE
          )
        }
        i = this.processingProgressBar(i, updateLicensesData.Licenses.length)
      }
    }
    if (
      updateLicensesData.SubLicenses &&
      updateLicensesData.SubLicenses.length > 0
    ) {
      for (const item of updateLicensesData.SubLicenses) {
        let findSubLicense = await SubLicenseRepository.findOne({
          subLicenseId: item.subLicenseId
        })
        if (findSubLicense) {
          const subLicenseBackup = {
            subLicenseId: findSubLicense._id,
            data: findSubLicense
          }
          listBackupSubLicense.push(subLicenseBackup)

          if (item.image) {
            let dataImage = await this.getFile(
              Env.get('AWS_PUBLIC_BUCKET_NAME'),
              `commands/subLicense/images/${item.image}`
            )
            let image = dataImage.body
            if (image) {
              const directory = 'sublicenses'
              const { imageOriginal, imageThumbnail, imageIntermediate } =
                await uploadFromS3Images(
                  findSubLicense._id,
                  directory,
                  item.image,
                  image
                )
              imageOriginal
                ? (findSubLicense.imageOriginal = imageOriginal)
                : findSubLicense.imageOriginal
              imageThumbnail
                ? (findSubLicense.imageThumbnail = imageThumbnail)
                : findSubLicense.imageThumbnail
              imageIntermediate
                ? (findSubLicense.imageIntermediate = imageIntermediate)
                : findSubLicense.imageIntermediate
            } else {
              console.log(
                `Image not found: ${item.image} for sub license ${item.subLicenseId}`
              )
              continue
            }
          }
          item.SubLicenses.accessibleIdentifier
            ? (findSubLicense.accessibleIdentifier =
                item.SubLicenses.accessibleIdentifier)
            : findSubLicense.accessibleIdentifier

          item.SubLicenses.inaccessibleIdentifier
            ? (findSubLicense.inaccessibleIdentifier =
                item.SubLicenses.inaccessibleIdentifier)
            : findSubLicense.inaccessibleIdentifier

          item.SubLicenses.companyUsers
            ? (findSubLicense.companyUsers = item.SubLicenses.companyUsers)
            : findSubLicense.companyUsers

          item.SubLicenses.status
            ? (findSubLicense.status = item.SubLicenses.status)
            : findSubLicense.status

          item.SubLicenses.hectareLimit
            ? (findSubLicense.hectareLimit = item.SubLicenses.hectareLimit)
            : findSubLicense.hectareLimit

          item.SubLicenses.hectareLimitIdentifier
            ? (findSubLicense.hectareLimitIdentifier =
                item.SubLicenses.hectareLimitIdentifier)
            : findSubLicense.hectareLimitIdentifier

          item.SubLicenses.hectareMinIdentifier
            ? (findSubLicense.hectareMinIdentifier =
                item.SubLicenses.hectareMinIdentifier)
            : findSubLicense.hectareMinIdentifier
          findSubLicense.save()

          await createEventAuditUseCase.execute(
            findSubLicense._id,
            IEntity.SUBLICENSE,
            EOperationTypeDataBase.UPDATE
          )
        }
        j = this.processingProgressBar(j, updateLicensesData.SubLicenses.length)
      }
    }

    await StorageRepository.create(listBackupLicense, this.licenseBackup)
    await StorageRepository.create(listBackupSubLicense, this.subLicenseBackup)
  }

  /**
   * Rollback Command
   */
  public async rollback(): Promise<void> {
    let i: number = 0
    let j: number = 0
    const dataLicense = await StorageRepository.get(this.licenseBackup)
    const dataSubLicense = await StorageRepository.get(this.subLicenseBackup)

    for (const item of dataLicense) {
      await LicenseRepository.update(
        { _id: item.idLicense },
        { $set: item.data }
      )
      i = this.processingProgressBar(i, dataLicense.length)
    }

    for (const item of dataSubLicense) {
      await SubLicenseRepository.update(
        { _id: item.subLicenseId },
        { $set: item.data }
      )
      j = this.processingProgressBar(j, dataLicense.length)
    }
    // await StorageRepository.delete(this.licenseBackup)
    // await StorageRepository.delete(this.subLicenseBackup)
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

  // /**
  //  * @function validate
  //  * @description Validate if data is not empty
  //  * @param data
  //  * @return String || Boolean
  //  * */

  // private async validate(data: string): Promise<string | boolean> {
  //   if (!data) {
  //     return 'Can not be empty'
  //   }
  //   return true
  // }
}
