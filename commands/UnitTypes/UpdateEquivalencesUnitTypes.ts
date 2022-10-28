import { BaseCommand, flags } from '@adonisjs/core/build/standalone'
import StorageRepository from 'App/Core/Storage'
import UnitTypeRepository from 'App/Core/UnitType/Infrastructure/Mongoose/Repositories'
import { unitTypesEquivalences } from '../../dataset/unitTypesEquivalences'

export default class UpdateEquivalencesUnitTypes extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'update:equivalences:unittypes'

  private nameFileBackup: string = 'update-unittypes-equivalences.json'

  @flags.boolean({ alias: 'r', description: 'Rollback flag' })
  public rollbackCommand: boolean

  /**
   * Command description is displayed in the "help" output
   */
  public static description =
    'This command update the collection unittypes with their equivalences'

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
      if (item.status === 'new') {
        const key = item.key
        await UnitTypeRepository.deleteOne({ key })
      } else {
        await UnitTypeRepository.findOneAndUpdate(
          {
            key: item.newKey
          },
          { ...item }
        )
      }
      i = this.processingProgressBar(i, data.length)
    }

    //await StorageRepository.delete(this.nameFileBackup)
  }

  public async execute(): Promise<void> {
    let i = 0
    const allUnits = await UnitTypeRepository.findAll({})
    let resultStoreBack: any[] = []

    for (const item of unitTypesEquivalences) {
      const existUnitTypeKey = allUnits.find(
        (unitType) => unitType.key.toLowerCase() === item.unit.toLowerCase()
      )

      const unitTypeForUpdate = allUnits.find((unitType) =>
        item.current_units?.includes(unitType.key.toLowerCase())
      )

      const dataToCreateOrUpdate = {
        name: {
          es: item.es,
          en: item.en,
          pt: item.pt
        },
        key: item.unit,
        unitMeasureSystem: item.unitMeasureSystem,
        requireCropType: item.require_croptype,
        equivalence: {
          value: item.equivalence_value,
          unit: item.equivalence_unit
        }
      }

      if (!existUnitTypeKey) {
        const resultProccessInsert = await UnitTypeRepository.create(
          dataToCreateOrUpdate
        )
        resultStoreBack.push({
          ...resultProccessInsert.toJSON(),
          status: 'new'
        })
      }

      if (unitTypeForUpdate) {
        resultStoreBack.push({
          ...unitTypeForUpdate.toJSON(),
          status: 'edit',
          newKey: item.unit
        })
        await UnitTypeRepository.findOneAndUpdate(
          {
            _id: unitTypeForUpdate._id
          },
          { $set: dataToCreateOrUpdate }
        )
      }

      i = this.processingProgressBar(i, unitTypesEquivalences.length)
    }

    if (resultStoreBack) {
      await StorageRepository.create(resultStoreBack, this.nameFileBackup)
    }
  }

  public async run() {
    this.logger.success('Started update unittypes type with equivalences')
    try {
      if (this.rollbackCommand) {
        this.logger.success('Started rollback update unittypes')
        await this.rollback()
      } else {
        await this.execute()
      }
    } catch (error) {
      this.logger.error(`Error Message: ${error.message}`)
      this.logger.error(`Error: ${error}`)
    }
    this.logger.logUpdatePersist()
    this.logger.success('update unit types with equivalences Success')
  }
}
