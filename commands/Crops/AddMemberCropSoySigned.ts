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
import CropTypeRepository from 'App/Core/CropType/Infraestructure/Mongoose/Repositories'
import AppliedLicenseRepository from 'App/Core/AppliedLicenses/Infrastructure/Mongoose/Repositories'

export default class AddMemberCropSoySigned extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'add:member:crop:soy:signed'

  /**
   * Command description is displayed in the "help" output
   */
  public static description = 'This command add member in crop soy signed'

  private nameFileBackup: string = 'add-member-crop-soy-signed.json'

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
    this.logger.success('Started add member in crop soy signed')
    try {
      if (this.rollbackCommand) {
        this.logger.success('Started rollback add member in crop soy signed')
        await this.rollback()
      } else {
        await this.execute()
      }
    } catch (error) {
      this.logger.error(`Error Message: ${error.message}`)
      this.logger.error(`Error: ${error}`)
    }
    this.logger.logUpdatePersist()
    this.logger.success('Add member in crop soy signed Success')
  }

  public async execute(): Promise<void> {
    let i: number = 0
    let listBackup: Array<Object> = []
    let crop
    const key = await this.prompt.ask('Enter the key', {
      validate: this.validate
    })

    let data = await this.getFile(Env.get('AWS_PUBLIC_BUCKET_NAME'), key)
    let dataCrop = JSON.parse(data.body.toString('utf-8'))

    let findCropTypeSoy = await CropTypeRepository.findOne({
      key: dataCrop.key
    })

    const cursor = await CropRepository.findByCursor({
      cropType: findCropTypeSoy._id
    })
    const countCrop: number = await CropRepository.count({
      cropType: findCropTypeSoy._id
    })

    while ((crop = await cursor.next())) {
      let findAppliedLicense = await AppliedLicenseRepository.findOne({
        cropId: crop._id,
        licenseId: dataCrop.licenseId
      })

      if (!findAppliedLicense) continue

      const cropBackup = {
        cropId: crop._id.toString(),
        data: crop
      }
      listBackup.push(cropBackup)

      const memberDto = {
        type: dataCrop.type,
        producer: dataCrop.producer,
        user: dataCrop.userId,
        identifier: dataCrop.identifier,
        country: dataCrop.country
      }

      await CropRepository.findOneAndUpdate(
        { _id: crop._id },
        { $push: { members: memberDto } }
      )

      await createEventAuditUseCase.execute(
        crop._id,
        IEntity.CROP,
        EOperationTypeDataBase.UPDATE
      )

      i = this.processingProgressBar(i, countCrop)
    }

    // for (const item of addMemberCropSoySigned) {
    //   let findEvidence = await EvidenceConceptRepository.findOne({
    //     code: item.code
    //   })

    //   if (findEvidence) {
    //     const evidenceConceptBackup = {
    //       evidenceId: findEvidence._id,
    //       type: 'update',
    //       data: findEvidence
    //     }
    //     listBackup.push(evidenceConceptBackup)

    //     item.nameEn
    //       ? (findEvidence.name.en = item.nameEn)
    //       : findEvidence.name.en
    //     item.nameEs
    //       ? (findEvidence.name.es = item.nameEs)
    //       : findEvidence.name.es
    //     item.namePt
    //       ? (findEvidence.name.pt = item.namePt)
    //       : findEvidence.name.pt
    //     await findEvidence.save()
    //     await createEventAuditUseCase.execute(
    //       findEvidence._id,
    //       IEntity.EVIDENCECONCEPT,
    //       EOperationTypeDataBase.UPDATE
    //     )
    //   } else {
    //     let evidenceConceptDto: EvidenceConcept = {
    //       code: item.code,
    //       name: {}
    //     }

    //     item.nameEn ? (evidenceConceptDto.name.en = item.nameEn) : null
    //     item.nameEs ? (evidenceConceptDto.name.es = item.nameEs) : null
    //     item.namePt ? (evidenceConceptDto.name.pt = item.namePt) : null

    //     let evidenceConcept = await EvidenceConceptRepository.create(
    //       evidenceConceptDto
    //     )

    //     await createEventAuditUseCase.execute(
    //       evidenceConcept._id,
    //       IEntity.EVIDENCECONCEPT,
    //       EOperationTypeDataBase.CREATE
    //     )

    //     const evidenceConceptBackup = {
    //       evidenceId: evidenceConcept._id,
    //       type: 'create'
    //     }

    //     listBackup.push(evidenceConceptBackup)
    //   }
    //   i = this.processingProgressBar(i, addEvidenceConcept.length)
    // }

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
