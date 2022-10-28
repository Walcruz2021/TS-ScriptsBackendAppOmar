import { BaseCommand, flags } from '@adonisjs/core/build/standalone'
import EvidenceConceptRepository from 'App/Core/EvidenceConcept/Infrastructure/Mongoose/Repositories'
import StorageRepository from 'App/Core/Storage'
import Aws from '@ioc:Aws'
import Env from '@ioc:Adonis/Core/Env'
import { EvidenceConcept } from 'App/Core/EvidenceConcept/Infrastructure/Mongoose/Interfaces'
import { createEventAuditUseCase } from 'App/Core/EventsAuditEntities/Infrastructure/useCase'
import {
  EOperationTypeDataBase,
  IEntity
} from 'App/Core/EventsAuditEntities/Infrastructure/Mongoose/Interfaces/EventsAuditEntities.interface'

export default class AddEvidenceConcept extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'add:evidence:concept'

  /**
   * Command description is displayed in the "help" output
   */
  public static description = 'This command add evidence concept'

  private nameFileBackup: string = 'add-evidenceConcept.json'

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
    this.logger.success('Started add evidence concept')
    try {
      if (this.rollbackCommand) {
        this.logger.success('Started rollback add evidence concept')
        await this.rollback()
      } else {
        await this.execute()
      }
    } catch (error) {
      this.logger.error(`Error Message: ${error.message}`)
      this.logger.error(`Error: ${error}`)
    }
    this.logger.logUpdatePersist()
    this.logger.success('Add evidence concept Success')
  }

  public async execute(): Promise<void> {
    let i: number = 0
    let listBackup: Array<Object> = []
    const key = await this.prompt.ask('Enter the key', {
      validate: this.validate
    })

    let data = await this.getFile(Env.get('AWS_PUBLIC_BUCKET_NAME'), key)
    let addEvidenceConcept = JSON.parse(data.body.toString('utf-8'))

    for (const item of addEvidenceConcept) {
      let findEvidence = await EvidenceConceptRepository.findOne({
        code: item.code
      })

      if (findEvidence) {
        const evidenceConceptBackup = {
          evidenceId: findEvidence._id,
          type: 'update',
          data: findEvidence
        }
        listBackup.push(evidenceConceptBackup)

        item.nameEn
          ? (findEvidence.name.en = item.nameEn)
          : findEvidence.name.en
        item.nameEs
          ? (findEvidence.name.es = item.nameEs)
          : findEvidence.name.es
        item.namePt
          ? (findEvidence.name.pt = item.namePt)
          : findEvidence.name.pt
        await findEvidence.save()
        await createEventAuditUseCase.execute(
          findEvidence._id,
          IEntity.EVIDENCECONCEPT,
          EOperationTypeDataBase.UPDATE
        )
      } else {
        let evidenceConceptDto: EvidenceConcept = {
          code: item.code,
          name: {}
        }

        item.nameEn ? (evidenceConceptDto.name.en = item.nameEn) : null
        item.nameEs ? (evidenceConceptDto.name.es = item.nameEs) : null
        item.namePt ? (evidenceConceptDto.name.pt = item.namePt) : null

        let evidenceConcept = await EvidenceConceptRepository.create(
          evidenceConceptDto
        )

        await createEventAuditUseCase.execute(
          evidenceConcept._id,
          IEntity.EVIDENCECONCEPT,
          EOperationTypeDataBase.CREATE
        )

        const evidenceConceptBackup = {
          evidenceId: evidenceConcept._id,
          type: 'create'
        }

        listBackup.push(evidenceConceptBackup)
      }
      i = this.processingProgressBar(i, addEvidenceConcept.length)
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
      if (item.type === 'create') {
        await EvidenceConceptRepository.deleteOne({ _id: item.evidenceId })
      }
      if (item.type === 'update') {
        await EvidenceConceptRepository.update(
          { _id: item.evidenceId },
          { $set: item.data }
        )
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
