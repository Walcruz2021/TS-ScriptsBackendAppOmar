import { BaseCommand, flags } from '@adonisjs/core/build/standalone'
import StorageRepository from 'App/Core/Storage'
import SupplyRepository from 'App/Core/Supply/Infrastructure/Mongoose/Repositories'
import {
  EOperationTypeDataBase,
  IEntity
} from 'App/Core/EventsAuditEntities/Infrastructure/Mongoose/Interfaces/EventsAuditEntities.interface'
import { createEventAuditUseCase } from 'App/Core/EventsAuditEntities/Infrastructure/useCase'

export default class AddSupplyBrand extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'add:supply:brand'

  /**
   * Command description is displayed in the "help" output
   */
  public static description = 'add brand in supply seed'

  @flags.boolean({ alias: 'r', description: 'Rollback flag' })
  public rollbackCommand: boolean

  private nameFileBackup: string = 'add-supply-brand.json'

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
    this.logger.success('Started add brand in supply seed')
    try {
      if (this.rollbackCommand) {
        this.logger.success('Started rollback add brand in supply seed')
        await this.rollback()
      } else {
        await this.execute()
      }
    } catch (error) {
      this.logger.error(`Error Message: ${error.message}`)
      this.logger.error(`Error: ${error}`)
    }
    this.logger.logUpdatePersist()
    this.logger.success('Add brand in supply seed Success')
  }

  public async execute(): Promise<void> {
    let i: number = 0
    let listBackup: Array<Object> = []

    const supplyToAddBrand = await SupplyRepository.findAll({
      name: { $ne: '' },
      supplyType: { $nin: ['HE', 'FU', 'Otros', 'IN'] },
      brand: null
    })

    for (const supply of supplyToAddBrand) {
      const supplyBackup = {
        supplyId: supply._id,
        data: supply
      }
      listBackup.push(supplyBackup)
      await SupplyRepository.findOneAndUpdate(
        {
          _id: supply._id
        },
        {
          $set: {
            brand: supply.name
          }
        }
      )

      await createEventAuditUseCase.execute(
        supply._id,
        IEntity.SUPPLY,
        EOperationTypeDataBase.UPDATE
      )
      i = this.processingProgressBar(i, supplyToAddBrand.length)
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
      await SupplyRepository.findOneAndUpdate(
        { _id: item.supplyId },
        { $unset: { brand: '' } }
      )

      i = this.processingProgressBar(i, data.length)
    }

    await StorageRepository.delete(this.nameFileBackup)
  }
}
