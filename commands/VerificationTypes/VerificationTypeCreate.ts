import { BaseCommand, flags } from '@adonisjs/core/build/standalone'
import StorageRepository from 'App/Core/Storage'
import CompanyRepository from 'App/Core/Company/Infrastructure/Mongoose/Repositories'
import { CompanyRepositoryContract } from 'App/Core/Company/Infrastructure/Contracts'
import { StorageContract } from 'App/Core/Storage/Contracts'
import { CropTypeRepositoryContract } from 'App/Core/CropType/Contracts'
import CropTypeRepository from 'App/Core/CropType/Infraestructure/Mongoose/Repositories'
import { VerificationTypeRepositoryContract } from 'App/Core/VerificationType/Contracts'
import VerificationTypeRepository from 'App/Core/VerificationType/Infrastructure/Mongoose/Repositories'
import FileDocumentRepository from 'App/Core/FileDocument/Infrastructure/Mongoose/Repositories'
import alasql from 'alasql'
import axios from 'axios'

export default class VerificationTypeCreate extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'verificationType:create'

  /**
   * Command description is displayed in the "help" output
   */
  public static description = ''

  @flags.boolean({ alias: 'r', description: 'Rollback flag' })
  public rollbackCommand: boolean

  private nameFileBackup: string = 'verificationType-create.json'

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

  /**
   * CompanyRepository
   */
  private companyRepo: CompanyRepositoryContract

  /**
   * StorageRepository
   */
  private storageRepo: StorageContract

  /**
   * CropTypeRepository
   */
  private cropTypeRepo: CropTypeRepositoryContract

  /**
   * VerificationTypeRepository
   */
  private verificationTypeRepo: VerificationTypeRepositoryContract

  private async setRepositories(): Promise<void> {
    this.companyRepo = CompanyRepository
    this.storageRepo = StorageRepository
    this.cropTypeRepo = CropTypeRepository
    this.verificationTypeRepo = VerificationTypeRepository
  }

  private async rollback(): Promise<void> {
    let i: number = 0
    const data = await this.storageRepo.get(this.nameFileBackup)
    for (const item of data) {
      const query = {
        _id: item._id
      }
      await this.verificationTypeRepo.deleteOne(query)
      i = this.processingProgressBar(i, data.length)
    }
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
        )} ${currentPercentage}%`
      )
    }
    return index
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
   * @function validateFiles
   * @description Validate if the id document
   * @param value Document id
   * @return String || Boolean
   * */

  private async validateFile(value: string): Promise<string | boolean> {
    if (!value) {
      return 'Invalid document id'
    }
    const query = {
      nameFile: value
    }
    const file = await FileDocumentRepository.findOne(query)
    if (!file) {
      return 'No document found'
    }
    return true
  }

  private async validateRow(row: any, numberRow: number) {
    let response = {
      company: null,
      cropType: null
    }

    const company = await this.companyRepo.findOne({ _id: row.company })
    if (!company) {
      this.logger.error(
        `Error: company  ${row.company} dont exist, in ${numberRow}`
      )
      return response
    }
    response.company = company

    const cropType = await this.cropTypeRepo.findOne({ key: row.cropType })
    if (!cropType) {
      this.logger.error(
        `Error: cropType ${row.cropType} dont exist in DB , in ${numberRow}`
      )
      return response
    }
    response.cropType = cropType

    const verificationTypeFound = await this.verificationTypeRepo.findOne({
      key: row.key
    })
    if (verificationTypeFound) {
      this.logger.error(
        `Error: verification type : '${row.key} ' exist in DB , row :  ${numberRow}`
      )
      response.company = null
      response.cropType = null
      return response
    }

    return response
  }

  /**
   * Execute method command.
   */
  private async execute(): Promise<void> {
    try {
      const nameFile = await this.prompt.ask(
        'Enter name  by your file for import data',
        {
          validate: async (value) => await this.validateFile(value)
        }
      )

      const file = await FileDocumentRepository.findOne({
        nameFile
      })

      try {
        const response = await axios.get(file.path)
        const data = response.data
        const storageBackup: Record<string, string>[] = []
        let elementsToInsert: any[] = []

        for (let i = 0; i < data.length; i++) {
          let dataValidate: any = await this.validateRow(data[i], i + 1)
          if (dataValidate.cropType && dataValidate.company) {
            data[i].identifier = dataValidate.company.identifier
            data[i].nameCompany = dataValidate.company.name
            data[i].cropTypeId = dataValidate.cropType._id
            elementsToInsert.push(data[i])
          }
        }

        const keysVerification = alasql(
          'SELECT key, MAX(en) as en, MAX(es) as es, MAX(pt) as pt FROM ? GROUP BY key',
          [elementsToInsert]
        )

        for (let verificationType of keysVerification) {
          verificationType.name = {
            es: verificationType.es,
            en: verificationType.en,
            pt: verificationType.pt
          }
          verificationType.cropTypes = alasql(
            'SELECT cropType as key , MAX(cropTypeId) as cropType FROM ? WHERE key = ? GROUP BY cropType',
            [elementsToInsert, verificationType.key]
          )

          verificationType.companies = alasql(
            'SELECT company, MAX(logo) as image, MAX(identifier) as identifier, MAX(nameCompany)  as name  FROM ? WHERE key = ? GROUP BY company',
            [elementsToInsert, verificationType.key]
          )

          for (let company of verificationType.companies) {
            const availableCropTypes = alasql(
              'SELECT cropType as key FROM ? WHERE key = ? and company = ? GROUP BY cropType',
              [elementsToInsert, verificationType.key, company.company]
            )

            company.availableCropTypes = availableCropTypes.map((e) => e.key)
          }

          delete verificationType.es
          delete verificationType.pt
          delete verificationType.en

          //insert here
          const verificationTypeDocument =
            await this.verificationTypeRepo.create(verificationType)
          storageBackup.push({
            _id: String(verificationTypeDocument._id)
          })
        }
        await StorageRepository.create(storageBackup, this.nameFileBackup)
        console.log(JSON.stringify(keysVerification))
      } catch (error) {
        this.logger.error(error.toString())
      }

      this.logger.success('Proccess end ----2e')
    } catch (err) {
      this.logger.error(err.toString())
    }
  }

  public async run() {
    await this.setRepositories()
    this.logger.success('Started proccess')
    try {
      if (this.rollbackCommand) {
        await this.rollback()
      } else {
        await this.execute()
      }
    } catch (error) {
      this.logger.error(`Error Message: ${error.message}`)
      this.logger.error(`Error: ${error}`)
    }
    this.logger.logUpdatePersist()
    this.logger.success('Proccess Success')
  }
}
