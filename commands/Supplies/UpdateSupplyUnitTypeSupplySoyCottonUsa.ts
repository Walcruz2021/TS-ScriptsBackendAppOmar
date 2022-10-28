import { BaseCommand, flags } from '@adonisjs/core/build/standalone'
import StorageRepository from 'App/Core/Storage'
import { createEventAuditUseCase } from 'App/Core/EventsAuditEntities/Infrastructure/useCase'
import {
  EOperationTypeDataBase,
  IEntity
} from 'App/Core/EventsAuditEntities/Infrastructure/Mongoose/Interfaces/EventsAuditEntities.interface'
import SupplyRepository from 'App/Core/Supply/Infrastructure/Mongoose/Repositories'

export default class UpdateSupplyUnitTypeSupplySoyCottonUsa extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'supply:update:unitType:supply:soy:cotton:usa'
  /**
   * Command description is displayed in the "help" output
   */
  public static description =
    'This command update unitTypeSupply in supply soy and cotton usa'

  private nameFileBackup: string =
    'update-supply-unitTypeSupply-soy-cotton-usa.json'

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
    this.logger.success(
      'Started update unitTypeSupply in supply soy and cotton usa'
    )
    try {
      if (this.rollbackCommand) {
        this.logger.success(
          'Started rollback update unitTypeSupply in supply soy and cotton usa'
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
    this.logger.success(
      'Update unitTypeSupply in supply soy and cotton usa Success'
    )
  }

  public async execute(): Promise<void> {
    let i: number = 0
    let listBackup: Array<Object> = []
    const idSupplySeedSoy = '346564643430633836343334'
    const idSupplySeedCotton = '346564643430633836343337'
    const idUnitTypeSupplySeed = '628c4b1d7b798d81293e33c4'

    let findSupply = await SupplyRepository.findAll({
      typeId: {
        $in: [idSupplySeedSoy, idSupplySeedCotton]
      },
      alphaCode: 'USA',
      unitTypeSupply: { $ne: idUnitTypeSupplySeed }
    })

    for (const supply of findSupply) {
      const supplyBackup = {
        supplyId: supply._id,
        data: supply
      }
      listBackup.push(supplyBackup)

      await SupplyRepository.findOneAndUpdate(
        {
          _id: supply._id
        },
        { $set: { unitTypeSupply: idUnitTypeSupplySeed } }
      )

      await createEventAuditUseCase.execute(
        supply._id,
        IEntity.SUPPLY,
        EOperationTypeDataBase.UPDATE
      )

      i = this.processingProgressBar(i, findSupply.length)
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
      await SupplyRepository.update({ _id: item.supplyId }, { $set: item.data })

      i = this.processingProgressBar(i, data.length)
    }

    await StorageRepository.delete(this.nameFileBackup)
  }
}
