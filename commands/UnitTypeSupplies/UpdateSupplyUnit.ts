import { BaseCommand, flags } from '@adonisjs/core/build/standalone'
import StorageRepository from 'App/Core/Storage'
import SupplyRepository from 'App/Core/Supply/Infrastructure/Mongoose/Repositories'
import { currentUnitTypeSuppliesKeys } from '../../dataset/currentUnitTypeSuppliesKeys'
import { UnitMeasureSystemEnum } from 'App/Core/Company/enums/UnitMeasureSystem.enum'
import { SupplyDocument } from 'App/Core/Supply/Infrastructure/Mongoose/Interfaces'
import { MongoClient, ObjectId } from 'mongodb'
import Env from '@ioc:Adonis/Core/Env'
import { DATABASE_URL } from 'App/utils'
import { unitTypeSupplyCollectionName } from 'App/Core/UnitTypeSupply/Infrastructure/Mongoose/Interfaces/UnitTypeSupply.interface'
import UnitTypeSupplyRepository from 'App/Core/UnitTypeSupply/Infrastructure/Mongoose/Repositories'

export default class UpdateSupplyUnit extends BaseCommand {
  /**
   * connection
   */
  private connection: MongoClient
  /**
   * Command name is used to run the command
   */
  public static commandName = 'supply:unit:update'

  /**
   * Command description is displayed in the "help" output
   */
  public static description = 'This command update unitTypesSupply in Supply'

  @flags.boolean({ alias: 'r', description: 'Rollback flag' })
  public rollbackCommand: boolean

  private nameFileBackup: string = 'supply-update-unitType.json'
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
    this.logger.success('Started Update Supply UnitTypes')
    try {
      if (this.rollbackCommand) {
        this.logger.success('Started rollback Update Supply UnitTypes')
        await this.rollback()
      } else {
        await this.execute()
      }
      await this.closeConnection()
    } catch (error) {
      this.logger.error(`Error Message: ${error.message}`)
      this.logger.error(`Error: ${error}`)
    }
    this.logger.logUpdatePersist()
    this.logger.success('Update Supply UnitTypes Success')
  }

  /**
   * Set Timestamps.
   */
  private async setCreatedAt(_id) {
    if (!this.connection) {
      this.connection = await MongoClient.connect(Env.get(DATABASE_URL))
    }
    // @ts-ignore
    const db = this.connection.db(this.connection.s.options.dbName)
    const collection = db.collection(String(unitTypeSupplyCollectionName))
    await collection.updateOne(
      { _id: new ObjectId(_id) },
      { $set: { createdAt: _id.getTimestamp() } }
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

  public async execute(): Promise<void> {
    let i: number = 0
    let supply
    let listSupplyBackup: Array<Object> = []
    const unitTypeSupplies = await UnitTypeSupplyRepository.findAll({})
    const cursor: Iterator<SupplyDocument> =
      await SupplyRepository.findByCursor({})
    const count = await SupplyRepository.count({})
    this.logger.info(`Supplies Found: ${count}`)
    while ((supply = await cursor.next())) {
      const currentUnitTypeSupplies =
        supply.alphaCode === 'USA'
          ? currentUnitTypeSuppliesKeys[UnitMeasureSystemEnum.IMPERIAL]
          : currentUnitTypeSuppliesKeys[UnitMeasureSystemEnum.METRIC]

      const unitTypeSuppliesKeys = currentUnitTypeSupplies
        .filter((keys) => keys.includes(supply.unit.toLowerCase()))
        .flat(1)

      const unitTypeSupply = unitTypeSupplies.find(
        (unitTypeSupply) =>
          unitTypeSupply.key.toLowerCase() === unitTypeSuppliesKeys[0]
      )

      if (unitTypeSupply) {
        const SupplyBackup = {
          supplyId: supply._id,
          unitTypeSupply: supply.unitTypeSupply
        }
        listSupplyBackup.push(SupplyBackup)

        await SupplyRepository.updateOne(
          {
            _id: supply._id
          },
          {
            $set: {
              unitTypeSupply: unitTypeSupply._id
            }
          }
        )
      }
      await this.setCreatedAt(supply._id)
      i = this.processingProgressBar(i, count)
    }

    await StorageRepository.create(listSupplyBackup, this.nameFileBackup)
  }

  /**
   * Rollback Command
   */
  public async rollback(): Promise<void> {
    let i: number = 0
    const data = await StorageRepository.get(this.nameFileBackup)

    for (const item of data) {
      await SupplyRepository.updateOne(
        {
          _id: item.supplyId
        },
        {
          $set: {
            unitTypeSupply: item.unitTypeSupply
          }
        }
      )
      i = this.processingProgressBar(i, data.length)
    }

    await StorageRepository.delete(this.nameFileBackup)
  }
}
