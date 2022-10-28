import { BaseCommand, flags } from '@adonisjs/core/build/standalone'
import { SupplyDocument } from 'App/Core/Supply/Infrastructure/Mongoose/Interfaces'
import Env from '@ioc:Adonis/Core/Env'
import { MongoClient, ObjectId } from 'mongodb'

export default class GenerateTimestampSupply extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'supply:timestamp:added'

  /**
   * Command description is displayed in the "help" output
   */
  public static description =
    'This command updates the timestamp of the supplies'

  /**
   * Name file backup command
   */
  private nameFileBackup: string = 'supply-timestamp-update.json'

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
  private connection: MongoClient

  /**
   * Calculate progress bar.
   *
   * @param number currentPercentage
   *
   * @return string
   */
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
   * Progress bar.
   *
   * @param number index
   * @param number index
   *
   * @return number
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
  /**
   * Execute Command
   */
  public async execute(): Promise<void> {
    const { default: SupplyRepository } = await import(
      '@ioc:Ucropit/Core/SupplyRepository'
    )
    const { default: StorageRepository } = await import(
      '@ioc:Ucropit/Core/StorageRepository'
    )
    const { default: CollectionVersionRepository } = await import(
      '@ioc:Ucropit/Core/CollectionVersionRepository'
    )
    let supply
    let i = 0
    let listSupplyBackup: Array<Object> = []
    await CollectionVersionRepository.deleteMany()
    const cursor: Iterator<SupplyDocument> =
      await SupplyRepository.findByCursor({})
    const countSupply: number = await SupplyRepository.count({})
    while ((supply = await cursor.next())) {
      listSupplyBackup.push(supply._id)
      supply.createdAt = supply._id.getTimestamp()
      await supply.save()
      i = this.processingProgressBar(i, countSupply)
    }
    await StorageRepository.create(listSupplyBackup, this.nameFileBackup)
  }

  /**
   * Rollback command
   */
  public async rollback(): Promise<void> {
    let i: number = 0
    const { default: StorageRepository } = await import(
      '@ioc:Ucropit/Core/StorageRepository'
    )
    const data = await StorageRepository.get(this.nameFileBackup)
    for (const id of data) {
      await this.unsetTimestamps(id)
      i = this.processingProgressBar(i, data.length)
    }
    await StorageRepository.delete(this.nameFileBackup)
    await this.closeConnection()
  }

  /**
   * Run command.
   */
  public async run() {
    this.logger.success('Started Add TimeStamp In Supply')
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
    this.logger.success('Update Supplies TimeStamp')
  }

  /**
   * Unset Timestamps.
   */
  private async unsetTimestamps(_id) {
    if (!this.connection) {
      this.connection = await MongoClient.connect(Env.get('DATABASE_URL'))
    }
    // @ts-ignore
    const db = this.connection.db(this.connection.s.options.dbName)
    const collection = db.collection(String('supplies'))
    await collection.updateOne(
      { _id: new ObjectId(_id) },
      { $unset: { createdAt: null, updatedAt: null } }
    )
  }
  /**
   * close Connection.
   */
  private async closeConnection() {
    if (this.connection) {
      await this.connection.close()
    }
  }
}
