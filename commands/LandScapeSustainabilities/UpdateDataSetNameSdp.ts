import { BaseCommand, flags } from '@adonisjs/core/build/standalone'
import StorageRepository from 'App/Core/Storage'
import LandscapeSustainabilityRepository from 'App/Core/LandscapeSustainability/Infrastructure/Mongoose/Repositories'

export default class UpdateDataSetNameSdp extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'landscapesustainability:update:dataset:name'

  /**
   * Command description is displayed in the "help" output
   */
  public static description =
    "This command use to update dataset's name landscape sustainability"

  @flags.boolean({ alias: 'r', description: 'Rollback flag and assignable' })
  public rollbackCommand: boolean

  private nameFileBackup: string = 'sustainability-schema-name-update.json'

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
   * @param number index
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

  public async run() {
    this.logger.success('Started update datasets name')
    try {
      if (this.rollbackCommand) {
        this.logger.success('Started rollback update datasets name')
        await this.rollback()
      } else {
        await this.execute()
      }
    } catch (error) {
      this.logger.error(`Error Message: ${error.message}`)
      this.logger.error(`Error: ${error}`)
    }
    this.logger.logUpdatePersist()
    this.logger.success('Finished updated datasets name')
  }

  public async execute() {
    let sustainabilitySchema
    let i = 0
    let count = 0
    const sustainabilitiesSchemasListBackup: Record<string, any>[] = []
    const query = {
      'datasets.name': 'Areas valiosas de pastizal'
    }

    const cursor = await LandscapeSustainabilityRepository.findByCursor(query)
    count = await LandscapeSustainabilityRepository.count(query)

    while ((sustainabilitySchema = await cursor.next())) {
      const schemaBackUp = {
        _id: sustainabilitySchema._id,
        datasetNameNow: 'PASTIZAL',
        datasetBackup: 'Areas valiosas de pastizal'
      }
      sustainabilitiesSchemasListBackup.push(schemaBackUp)

      await LandscapeSustainabilityRepository.findOneAndUpdate(
        {
          'datasets.name': 'Areas valiosas de pastizal'
        },
        { $set: { ['datasets.$.name']: 'PASTIZAL' } }
      )
      i = this.processingProgressBar(i, count)
    }

    await StorageRepository.create(
      sustainabilitiesSchemasListBackup,
      this.nameFileBackup
    )
  }

  public async rollback() {
    let i: number = 0
    const data = await StorageRepository.get(this.nameFileBackup)

    for (const item of data) {
      await LandscapeSustainabilityRepository.findOneAndUpdate(
        {
          _id: item._id
        },
        { $set: { ['datasets.$.name']: item.datasetBackup } }
      )
      i = this.processingProgressBar(i, data.length)
    }

    await StorageRepository.delete(this.nameFileBackup)
  }
}
