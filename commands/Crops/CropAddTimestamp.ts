import { BaseCommand, flags } from '@adonisjs/core/build/standalone'
import StorageRepository from 'App/Core/Storage'
import CropRepository from 'App/Core/Crop/Infrastructure/Mongoose/Repositories'
export default class CropAddTimestamp extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'crop:add:timestamp'

  /**
   * Command description is displayed in the "help" output
   */
  public static description = 'This command add timestamps in crops'
  @flags.boolean({ alias: 'r', description: 'Rollback flag' })
  public rollbackCommand: boolean

  private nameFileBackup: string = 'add-timestamp-crops.json'

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
    this.logger.success('Started add timestamps crops')
    try {
      if (this.rollbackCommand) {
        this.logger.success('Started rollback add timestamps crops')
        await this.rollback()
      } else {
        await this.execute()
      }
    } catch (error) {
      this.logger.error(`Error Message: ${error.message}`)
      this.logger.error(`Error: ${error}`)
    }
    this.logger.logUpdatePersist()
    this.logger.success('Add timestamps crops Success')
  }

  public async execute(): Promise<void> {
    let i: number = 0
    let listBackup: Array<Object> = []

    let crop

    const cursor = await CropRepository.findByCursor({
      createdAt: { $exists: false }
    })
    const countCrop: number = await CropRepository.count({
      createdAt: { $exists: false }
    })
    while ((crop = await cursor.next())) {
      const cropBackup = {
        cropId: crop._id.toString()
      }
      listBackup.push(cropBackup)
      await CropRepository.findOneAndUpdateTimestamp(
        {
          _id: crop._id
        },
        { createdAt: crop._id.getTimestamp() }
      )
      i = this.processingProgressBar(i, countCrop)
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
      await CropRepository.findOneAndUpdateTimestamp(
        {
          _id: item.cropId
        },
        { $unset: { createdAt: '' } }
      )

      i = this.processingProgressBar(i, data.length)
    }

    await StorageRepository.delete(this.nameFileBackup)
  }
}
