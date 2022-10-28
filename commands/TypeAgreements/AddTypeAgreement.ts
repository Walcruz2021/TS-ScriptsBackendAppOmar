import { BaseCommand, flags } from '@adonisjs/core/build/standalone'
import TypeAgreementRepository from 'App/Core/TypeAgreement/Infrastructure/Mongoose/Repositories'
import StorageRepository from 'App/Core/Storage'
import { TypeAgreement } from 'App/Core/TypeAgreement/Infrastructure/Mongoose/Interfaces'
import { createEventAuditUseCase } from 'App/Core/EventsAuditEntities/Infrastructure/useCase'
import {
  EOperationTypeDataBase,
  IEntity
} from 'App/Core/EventsAuditEntities/Infrastructure/Mongoose/Interfaces/EventsAuditEntities.interface'
import axios from 'axios'

export default class AddTypeAgreement extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'add:type:agreement'

  /**
   * Command description is displayed in the "help" output
   */
  public static description = 'This command add type agreement'

  private nameFileBackup: string = 'add-typeAgreement.json'

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
    this.logger.success('Started add type agreement')
    try {
      if (this.rollbackCommand) {
        this.logger.success('Started rollback add type agreement')
        await this.rollback()
      } else {
        await this.execute()
      }
    } catch (error) {
      this.logger.error(`Error Message: ${error.message}`)
      this.logger.error(`Error: ${error}`)
    }
    this.logger.logUpdatePersist()
    this.logger.success('Add type agreement Success')
  }

  public async execute(): Promise<void> {
    let i: number = 0
    let listBackup: Array<Object> = []
    const url = await this.prompt.ask('Enter the url', {
      validate: this.validate
    })

    let addTypeAgreement = await this.getFile(url)

    for (const item of addTypeAgreement) {
      let findTypeAgreement = await TypeAgreementRepository.findOne({
        key: item.key
      })

      if (findTypeAgreement) {
        const typeAgreementBackup = {
          typeAgreementId: findTypeAgreement._id,
          type: 'update',
          data: findTypeAgreement
        }
        listBackup.push(typeAgreementBackup)

        item.nameEn
          ? (findTypeAgreement.name.en = item.nameEn)
          : findTypeAgreement.name.en
        item.nameEs
          ? (findTypeAgreement.name.es = item.nameEs)
          : findTypeAgreement.name.es
        item.namePt
          ? (findTypeAgreement.name.pt = item.namePt)
          : findTypeAgreement.name.pt
        findTypeAgreement.visible = item.visible

        await createEventAuditUseCase.execute(
          findTypeAgreement._id,
          IEntity.TYPEAGREEMENT,
          EOperationTypeDataBase.UPDATE
        )

        await findTypeAgreement.save()
      }

      if (!findTypeAgreement) {
        let typeAgreementDto: TypeAgreement = {
          key: item.key,
          name: {},
          visible: item.visible
        }

        item.nameEn ? (typeAgreementDto.name.en = item.nameEn) : null
        item.nameEs ? (typeAgreementDto.name.es = item.nameEs) : null
        item.namePt ? (typeAgreementDto.name.pt = item.namePt) : null

        let typeAgreement = await TypeAgreementRepository.create(
          typeAgreementDto
        )

        await createEventAuditUseCase.execute(
          typeAgreement._id,
          IEntity.TYPEAGREEMENT,
          EOperationTypeDataBase.CREATE
        )

        const typeAgreementBackup = {
          typeAgreementId: typeAgreement._id,
          type: 'create'
        }
        listBackup.push(typeAgreementBackup)
      }

      i = this.processingProgressBar(i, addTypeAgreement.length)
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
        await TypeAgreementRepository.deleteOne({ _id: item.typeAgreementId })
      }
      if (item.type === 'update') {
        await TypeAgreementRepository.update(
          { _id: item.typeAgreementId },
          { $set: item.data }
        )
      }

      i = this.processingProgressBar(i, data.length)
    }

    await StorageRepository.delete(this.nameFileBackup)
  }

  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  async getFile(url: string): Promise<any> {
    this.logger.await('Waiting for the data')

    return await this.makeRequestSync('get', url)
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

  public async makeRequestSync(
    method: string,
    url: string,
    body?: any,
    headers?: any
  ): Promise<Object> {
    return new Promise((resolve, reject) =>
      axios[method](url, body, { headers })
        .then(({ data }) => resolve(data))
        .catch((err) => reject(this.axiosParseError(err)))
    )
  }

  private axiosParseError(err) {
    const { response = {} } = err
    const { status = 500, data = {} } = response
    const { code = status, message = err.toString(), description } = data
    let msg = message
    if (typeof data === 'string') {
      msg = data.toString()
    }
    return {
      status,
      data: {
        ...data,
        code,
        message: msg,
        description
      },
      errorToString: err.toString()
    }
  }
}
