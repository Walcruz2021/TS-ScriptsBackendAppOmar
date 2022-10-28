import { BaseCommand, flags } from '@adonisjs/core/build/standalone'
import StorageRepository from 'App/Core/Storage'
import { createEventAuditUseCase } from 'App/Core/EventsAuditEntities/Infrastructure/useCase'
import {
  EOperationTypeDataBase,
  IEntity
} from 'App/Core/EventsAuditEntities/Infrastructure/Mongoose/Interfaces/EventsAuditEntities.interface'
import SupplyRepository from 'App/Core/Supply/Infrastructure/Mongoose/Repositories'
import UnitTypeSupplyRepository from 'App/Core/UnitTypeSupply/Infrastructure/Mongoose/Repositories'


export default class UpdateSupplyUsaUnitTypeSupply extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'update:supply:usa:unitTypeSupply'
  /**
   * Command description is displayed in the "help" output
   */
  public static description =
    'This command update unit type supply in supplies usa'

  private nameFileBackup: string = 'update-supply-usa-unitTypeSupply.json'

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
    this.logger.success('Started update unit type supply in supplies usa')
    try {
      if (this.rollbackCommand) {
        this.logger.success(
          'Started rollback update unit type supply in supplies usa'
        )
        await this.rollback()
      } else {
        await this.execute()
      }
    } catch (error) {
      this.logger.error(`Error Message: ${error.message}`)
      this.logger.error(`Error: ${error}`)
    }
    this.logger.logUpdatePersist()
    this.logger.success('Update unit type supply in supplies usa Success')
  }

  public async execute(): Promise<void> {
    let i: number = 0
    let listBackup: Array<Object> = []

    let findUnitTypeSupplyLb = await UnitTypeSupplyRepository.findOne({
      key: 'lb'
    })
    let findUnitTypeSupplyOz = await UnitTypeSupplyRepository.findOne({
      key: 'fl-oz'
    })

    let findSupplyUsa = await SupplyRepository.findAll({
      alphaCode: 'USA',
      unit: { $in: ['Kgs', 'Lts'] },
      unitTypeSupply: {
        $nin: [findUnitTypeSupplyLb._id, findUnitTypeSupplyOz._id]
      }
    })
    for (const item of findSupplyUsa) {
      const supplyBackup = {
        supplyId: item._id,
        unitTypeSupply: item.unitTypeSupply
      }
      listBackup.push(supplyBackup)

      await SupplyRepository.findOneAndUpdate(
        {
          _id: item._id
        },
        {
          $set: {
            ['unitTypeSupply']:
              item.unit === 'Kgs'
                ? findUnitTypeSupplyLb._id
                : findUnitTypeSupplyOz._id
          }
        }
      )

      await createEventAuditUseCase.execute(
        item._id,
        IEntity.SUPPLY,
        EOperationTypeDataBase.UPDATE
      )

      i = this.processingProgressBar(i, findSupplyUsa.length)
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
        {
          _id: item.supplyId
        },
        {
          $set: {
            ['unitTypeSupply']: item.unitTypeSupply
          }
        }
      )
      i = this.processingProgressBar(i, data.length)
    }

    await StorageRepository.delete(this.nameFileBackup)
  }
}
