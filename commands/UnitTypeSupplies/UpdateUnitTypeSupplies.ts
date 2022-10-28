import { BaseCommand, flags } from '@adonisjs/core/build/standalone'
import StorageRepository from 'App/Core/Storage'
import UnitTypeSupply from 'App/Core/UnitTypeSupply/Infrastructure/Mongoose/Models/UnitTypeSupply'

import UnitTypeSupplyRepository from 'App/Core/UnitTypeSupply/Infrastructure/Mongoose/Repositories'
import { unitTypeSuppliesSystem } from '../../dataset/unitTypeSuppliesSystem'

export default class UpdateUnitTypeSupplies extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'update:unittypesupplies'

  /**
   * Command description is displayed in the "help" output
   */
  public static description = 'This command update unit type supplies'

  private nameFileBackup: string = 'update-unit-type-supplies.json'

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

  public async rollback(): Promise<void> {
    let i: number = 0
    const data = await StorageRepository.get(this.nameFileBackup)

    for (const item of data) {
      i = this.processingProgressBar(i, data.length)
      const query = {
        _id: item._id
      }
      if (item.isCreated) {
        await UnitTypeSupplyRepository.deleteOne(query)
        continue
      }
      await UnitTypeSupply.updateOne(query, { ...item })
    }
  }

  public async execute(): Promise<void> {
    let i = 0

    const unityTypeSupplies = await UnitTypeSupply.find({})

    let resultBack: any[] = []

    for (const item of unitTypeSuppliesSystem) {
      i = this.processingProgressBar(i, unitTypeSuppliesSystem.length)
      const toSetData = {
        name: item.name,
        key: item.key.toLowerCase(),
        equivalences: [],
        unitMeasureSystem: item.system,
        typeMeasure: item.type_measure
      }
      let unitTypeSupplyFound = unityTypeSupplies.find((unityTypeSupplyItem) =>
        item.current_keys.includes(unityTypeSupplyItem.key.toLowerCase())
      )

      if (!unitTypeSupplyFound) {
        unitTypeSupplyFound = await UnitTypeSupplyRepository.create(toSetData)
        resultBack.push({
          ...unitTypeSupplyFound,
          isCreated: true
        })
        continue
      }

      const query = {
        _id: unitTypeSupplyFound._id
      }

      await UnitTypeSupplyRepository.updateOne(query, {
        // @ts-ignore
        $set: toSetData,
        $unset: { UnitMeasureSystem: '' }
      })

      resultBack.push({
        ...unitTypeSupplyFound.toJSON(),
        updatedAt: new Date()
      })
    }

    await StorageRepository.create(resultBack, this.nameFileBackup)
  }

  public async run() {
    this.logger.success('Started update unit type with system metric')
    try {
      if (this.rollbackCommand) {
        this.logger.success('Started rollback update unit type')
        await this.rollback()
      } else {
        await this.execute()
      }
    } catch (error) {
      this.logger.error(`Error Message: ${error.message}`)
      this.logger.error(`Error: ${error}`)
    }
    this.logger.logUpdatePersist()
    this.logger.success('update unit type with system metric Success')
  }
}
