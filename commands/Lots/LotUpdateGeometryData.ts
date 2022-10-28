import { BaseCommand, flags } from '@adonisjs/core/build/standalone'
import StorageRepository from 'App/Core/Storage'
import LotRepository from 'App/Core/Lot/Infrastructure/Mongoose/Repositories'
import {
  countLotWithAreaPipelines,
  getLotWithAreaPipelines
} from 'App/Core/Lot/Infrastructure/Mongoose/PipeLines'
import { generatePolygon } from 'App/Core/Lot/utils'

export default class LotUpdateGeometryData extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'lot:update:geometry:data'

  /**
   * Command description is displayed in the "help" output
   */
  public static description =
    'Command to add the geometry Data to the lot by means of its area, for those batches that do not have this field.'

  @flags.boolean({ alias: 'r', description: 'Rollback flag' })
  public rollbackCommand: boolean

  private nameFileBackup: string = 'lot-update-geometry-data.json'

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

  public async run() {
    this.logger.info('Add the geometry Data to the lot by means of its area')
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
    this.logger.success('Finish Update')
  }

  public async execute(): Promise<void> {
    let lot
    let i = 0
    let count = 0
    const lotListBackup: Record<string, any>[] = []

    const cursor = await LotRepository.cursor(getLotWithAreaPipelines)
    const results = await LotRepository.count(countLotWithAreaPipelines)
    if (results.length) {
      count = results[0].totals
    }
    this.logger.info(`Lots Found: ${count}`)
    while ((lot = await cursor.next())) {
      let geometryData
      let geometryDataBackup
      if (lot.geometryData) {
        geometryDataBackup = lot.geometryData
        geometryData =
          lot.geometryData.type === 'Feature'
            ? lot.geometryData.geometry
            : lot.geometryData
      } else {
        const feature = generatePolygon(lot.name, lot.area)
        geometryData = feature.geometry
      }

      const query = {
        _id: lot._id
      }
      const setData = {
        $set: {
          geometryData
        }
      }
      const lotBackup = {
        lotId: lot._id,
        geometryData: geometryDataBackup
      }
      lotListBackup.push(lotBackup)

      await LotRepository.updateOne(query, setData)

      i = this.processingProgressBar(i, count)
    }

    await StorageRepository.create(lotListBackup, this.nameFileBackup)
  }

  private async rollback(): Promise<void> {
    let i: number = 0
    const data = await StorageRepository.get(this.nameFileBackup)

    for (const item of data) {
      const query = {
        _id: item.lotId
      }
      const setData = {
        $set: { geometryData: item.geometryData }
      }
      await LotRepository.updateOne(query, setData)
      i = this.processingProgressBar(i, data.length)
    }
    await StorageRepository.delete(this.nameFileBackup)
  }
}
