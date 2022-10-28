import { BaseCommand, flags } from '@adonisjs/core/build/standalone'
import StorageRepository from 'App/Core/Storage'
import LotRepository from 'App/Core/Lot/Infrastructure/Mongoose/Repositories'
import Aws from '@ioc:Aws'
import * as turf from '@turf/turf'
import Env from '@ioc:Adonis/Core/Env'
export default class UpdateCoordinatesLots extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'update:coordinates:lots'

  /**
   * Command description is displayed in the "help" output
   */
  public static description = 'This command update coordinates lots'

  @flags.boolean({ alias: 'r', description: 'Rollback flag' })
  public rollbackCommand: boolean

  private nameFileBackup: string = 'update-coordinates-lots.json'

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
    this.logger.success('Started update coordinates lots')
    try {
      if (this.rollbackCommand) {
        this.logger.success('Started rollback update coordinates lots')
        await this.rollback()
      } else {
        await this.execute()
      }
    } catch (error) {
      this.logger.error(`Error Message: ${error.message}`)
      this.logger.error(`Error: ${error}`)
    }
    this.logger.logUpdatePersist()
    this.logger.success('Update coordinates lots Success')
  }

  public async execute(): Promise<void> {
    let i: number = 0
    let listBackup: Array<Object> = []

    const key = await this.prompt.ask('Enter the key', {
      validate: this.validate
    })

    let data = await this.getFile(Env.get('AWS_PUBLIC_BUCKET_NAME'), key)
    let updateLotsCoordinates = JSON.parse(data.body.toString('utf-8'))

    for (const item of updateLotsCoordinates) {
      let lotCurrent = await LotRepository.findOne({
        _id: item.properties.lot_id
      })
      if (lotCurrent) {
        const lotBackup = {
          lotId: lotCurrent._id,
          coordinatesPrevious: lotCurrent.geometryData.coordinates,
          surfacePrevious: lotCurrent.surface
        }
        listBackup.push(lotBackup)
        await LotRepository.findOneAndUpdate(
          {
            _id: lotCurrent._id
          },
          { 'geometryData.coordinates': item.geometry.coordinates }
        )
        lotCurrent = await LotRepository.findOne({ _id: lotCurrent._id })
        let newSurface = this.getSurface(lotCurrent.geometryData)
        await LotRepository.findOneAndUpdate(
          {
            _id: lotCurrent._id
          },
          { surface: newSurface }
        )
      }

      i = this.processingProgressBar(i, updateLotsCoordinates.length)
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
      await LotRepository.findOneAndUpdate(
        {
          _id: item.lotId
        },
        { 'geometryData.coordinates': item.coordinatesPrevious }
      )
      await LotRepository.findOneAndUpdate(
        {
          _id: item.lotId
        },
        { surface: item.surfacePrevious }
      )

      i = this.processingProgressBar(i, data.length)
    }

    await StorageRepository.delete(this.nameFileBackup)
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

  private getSurface(geometry) {
    const areaSquare = turf.area(geometry)
    const surface = this.roundToTwo(areaSquare / 10000)

    return surface
  }
  private roundToTwo(num: number) {
    return Math.round((num + Number.EPSILON) * 100) / 100
  }
}
