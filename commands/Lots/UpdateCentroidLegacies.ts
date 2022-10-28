import { BaseCommand, flags } from '@adonisjs/core/build/standalone'

import StorageRepository from 'App/Core/Storage'
import LotRepository from 'App/Core/Lot/Infrastructure/Mongoose/Repositories'
import { sendLegacyLotData } from 'App/Core/utils/Lots'

export default class UpdateCentroidLegacies extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'update:lots:centroid:legacies'

  /**
   * Command description is displayed in the "help" output
   */
  public static description =
    'This command is used for update farms legacies on all cases'

  @flags.boolean({ alias: 'r', description: 'Rollback flag' })
  public rollbackCommand: boolean

  private nameFileBackup: string = 'update-farms-legacy-all-cases.json'

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
  private processingProgressBar(index: number): number {
    if (index < 100) {
      index++
      this.logger.logUpdate(
        `Processing: ${this.getProgressBar(index)} ${index}%`
      )
    }
    return index
  }

  /**
   * Execute Command
   */
  public async execute(): Promise<void> {
    let index = 0
    const lots: any = await LotRepository.findAll({ centerBound: null })
    await StorageRepository.create(
      {
        lots
      },
      this.nameFileBackup
    )
    if (!lots.length) {
      this.logger.info('No lots legacy to update')
      this.exit()
    }
    try {
      for (const lot of lots) {
        if (lot?.uuid) {
          const response: any = await sendLegacyLotData(lot.uuid)
          if (response?.data) {
            if (response.data.document?.modified) index++
            this.logger.info(
              `Field Row: ${lot.uuid} modified: ${response.data?.row?.modified}`
            )
            this.logger.info(
              `Field Document: ${lot.uuid} modified: ${response.data?.document?.modified}`
            )
          }
        }
      }
      this.logger.info(`Number of modified fields : ${index} `)
    } catch (error) {
      this.logger.error(`Error: ${error}`)
    }
  }

  /**
   * Rollback Command
   */
  public async rollback(): Promise<void> {
    let i: number = 0

    const data = await StorageRepository.get(this.nameFileBackup)

    for (const lot of data.lots) {
      await LotRepository.replaceOne(
        {
          _id: lot._id
        },
        {
          ...lot
        }
      )

      i = this.processingProgressBar(i)
    }

    await StorageRepository.delete(this.nameFileBackup)
  }

  public async run() {
    try {
      if (this.rollbackCommand) {
        this.logger.info('Start Process Rollback Lot Centroid Legacy')

        await this.rollback()
      } else {
        this.logger.info('Start Process Update  Lot Centroid Legacy')

        await this.execute()
      }
    } catch (error) {
      this.logger.error(`Error Message: ${error.message}`)
      this.logger.error(`Error: ${error}`)
    }

    this.logger.logUpdatePersist()
    this.logger.success(' Lot Centroid Legacy data done')
  }
}
