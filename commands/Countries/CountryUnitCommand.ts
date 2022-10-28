import { BaseCommand, flags } from '@adonisjs/core/build/standalone'
import StorageRepository from 'App/Core/Storage'
import CountryRepository from 'App/Core/Country/Infraestructure/Mongoose/Repositories'
import { UnitMeasureSystemEnum } from 'App/Core/Country/Infraestructure/enums/UnitMeasureSystemEnum'
export default class CountryUnitCommand extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'country:unit:command'
  @flags.boolean({ alias: 'r', description: 'Rollback flag' })
  public rollbackCommand: boolean

  private nameFileBackup: string = 'update-unit-country.json'

  /**
   * constant that defines countries that use the imperial system
   */
  private imperialSystemCountries = ['USA']

  /**
   * Command description is displayed in the "help" output
   */
  public static description =
    'This command adds the UnitMeasureSystem property to the countries'

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
    this.logger.success('Started update country measure unit')
    try {
      if (this.rollbackCommand) {
        this.logger.success('Started rollback update country measure unit')
        await this.rollback()
      } else {
        await this.execute()
      }
    } catch (error) {
      this.logger.error(`Error Message: ${error.message}`)
      this.logger.error(`Error: ${error}`)
    }
    this.logger.logUpdatePersist()
    this.logger.success('Update unit country measure unit Success')
  }

  public async execute() {
    let i: number = 0

    let countryBackup: Array<Object> = []

    const countries = await CountryRepository.findAll({})

    for (const item of countries) {
      const countryUnitBackup = {
        countryId: item._id
      }
      countryBackup.push(countryUnitBackup)
      const query = { _id: item._id }
      await CountryRepository.findOneId(query)
      const unitMeasureSystem = this.imperialSystemCountries.includes(
        item.alpha3Code
      )
        ? UnitMeasureSystemEnum.IMPERIAL
        : UnitMeasureSystemEnum.METRIC
      await CountryRepository.updateOne(query, { $set: { unitMeasureSystem } })

      i = this.processingProgressBar(i, countries.length)
    }

    await StorageRepository.create(countryBackup, this.nameFileBackup)
  }

  /**
   * Rollback Command
   */
  public async rollback(): Promise<void> {
    let i: number = 0
    const data = await StorageRepository.get(this.nameFileBackup)

    for (const item of data) {
      const query = { _id: item.countryId }
      await CountryRepository.updateOne(query, {
        $unset: { unitMeasureSystem: '' }
      })

      i = this.processingProgressBar(i, data.length)
    }

    await StorageRepository.delete(this.nameFileBackup)
  }
}
