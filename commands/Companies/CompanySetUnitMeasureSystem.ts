import { BaseCommand, flags } from '@adonisjs/core/build/standalone'

import CompanyRepository from 'App/Core/Company/Infrastructure/Mongoose/Repositories'
import CountryRepository from 'App/Core/Country/Infraestructure/Mongoose/Repositories'
import { UnitMeasureSystemEnum } from 'App/Core/Company/enums/UnitMeasureSystem.enum'

export default class CompanySetUnitMeasureSystem extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'company:set_unit_measure_system'

  @flags.boolean({ alias: 'r', description: 'Rollback flag' })
  public rollbackCommand: boolean

  /**
   * Command description is displayed in the "help" output
   */
  public static description = ''

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
        )} ${currentPercentage}%`
      )
    }
    return index
  }

  private async execute(): Promise<void> {
    const companies = await CompanyRepository.findAllWithCountry({})
    let i = 0
    for (const { _id, country } of companies) {
      const { alpha3Code } =
        (await CountryRepository.findOne({ _id: country })) ?? {}
      await CompanyRepository.findOneAndUpdate(
        {
          _id: _id
        },
        {
          $set: {
            unitMeasureSystem:
              alpha3Code === 'USA'
                ? UnitMeasureSystemEnum.IMPERIAL
                : UnitMeasureSystemEnum.METRIC
          }
        }
      )
      i = this.processingProgressBar(i, companies.length)
    }
  }
  /**
   * Rollback command
   */
  private async rollback(): Promise<void> {
    await CompanyRepository.updateMany(
      {},
      { $unset: { unitMeasureSystem: '' } }
    )
  }
  /**
   * Run command.
   */
  public async run() {
    this.logger.success('Started Update Company')
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
    this.logger.success('Update Company Success')
  }
}
