import { BaseCommand, flags } from '@adonisjs/core/build/standalone'
import StorageService from 'App/Core/Storage/Services/StorageService'
import CompanyRepository from 'App/Core/Company/Infrastructure/Mongoose/Repositories'
import CompanyTypeRepository from 'App/Core/CompanyType/Infrastructure/Mongoose/Repositories'
import { companiesToUpdateCompanyType } from '../../dataset/resources/update-company-types.json'
import { existsSync } from 'fs'
import AwsS3Service from 'App/Core/Storage/Services/AwsS3Service'

export default class UpdateCompanyTypesByGivenData extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'update:company:types:by:given:data'

  /**
   * Command description is displayed in the "help" output
   */
  public static description =
    'use this command to update company types by given data in json file'

  private nameFileBackup: string = 'update-company-type-by-given-data.json'

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
   * @param limit index
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

  public async rollback(): Promise<void> {
    try {
      let i: number = 0

      const companies = await StorageService.get(this.nameFileBackup)
      for (const company of companies) {
        i = this.processingProgressBar(i, companies.length)
        await CompanyRepository.replaceOne({ _id: company._id }, { ...company })
      }
    } catch (err) {
      this.logger.error(err)
      this.exit()
    }
  }

  public async execute(): Promise<void> {
    const currentDate = new Date()
    let i: number = 0
    let updatedCompanies: number = 0
    let companyErrors: any[] = []

    const hasRollbackData = existsSync(this.nameFileBackup)
    if (!hasRollbackData) {
      await StorageService.create([], this.nameFileBackup)
    }

    const companyTypes = await CompanyTypeRepository.findAll({})

    if (!companyTypes.length) {
      this.logger.info(`Company types dont loaded yet`)
      this.exit()
    }

    for (const company of companiesToUpdateCompanyType) {
      i = this.processingProgressBar(i, companiesToUpdateCompanyType.length)
      const { identifier, companyType } = company

      const companyToUpdate = await CompanyRepository.findOne({ identifier })

      if (!companyToUpdate) {
        companyErrors.push({
          error: true,
          identifier,
          message: 'Company not found'
        })
        continue
      }

      const companyTypeInDb = companyTypes.find(
        ({ name }) => name === companyType
      )

      if (!companyTypeInDb) {
        companyErrors.push({
          error: true,
          identifier,
          message: 'Company type not found'
        })
        continue
      }
      await StorageService.add(companyToUpdate, this.nameFileBackup)

      const typesToUpdate = [companyTypeInDb?._id]

      await CompanyRepository.findOneAndUpdate(
        { _id: companyToUpdate._id },
        { types: typesToUpdate }
      )

      updatedCompanies++
    }

    const response = await AwsS3Service.upload(
      `results-commands/updating-company-types-${currentDate.getTime()}.json`,
      Buffer.from(JSON.stringify(companyErrors, null, 2)),
      'application/json',
      '',
      'public-read'
    )

    this.logger.info(`companies updated: ${updatedCompanies}`)
    this.logger.info(`companies with error: ${companyErrors.length}`)
    this.logger.info(`companies with error detail url: ${response.Location}`)
  }

  public async run() {
    this.logger.info('Started update of company type by given data.')
    try {
      if (this.rollbackCommand) {
        this.logger.success('Started rollback company types')
        await this.rollback()
      } else {
        await this.execute()
      }
    } catch (error) {
      this.logger.error(`Error Message: ${error.message}`)
      this.logger.error(`Error: ${error}`)
    }
    this.logger.logUpdatePersist()
    this.logger.success('Update company types finished.')
  }
}
