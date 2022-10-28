import { BaseCommand, flags } from '@adonisjs/core/build/standalone'
import StorageRepository from 'App/Core/Storage'
import SupplyRepository from 'App/Core/Supply/Infrastructure/Mongoose/Repositories'
import ActivityRepository from 'App/Core/Activity/Infrastructure/Mongoose/Repositories'
const listActivities = require('../../jsonActivities.json')

export default class UpdateBrandAndUnitTypeSupplies extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'update:brandAndUnitTypeSupplies'

  /**
   * Command description is displayed in the "help" output
   */
  public static description = 'This command update activity unit type supply'
  @flags.boolean({ alias: 'r', description: 'Rollback flag' })
  public rollbackCommand: boolean

  private nameFileBackup: string = 'update-brandAndUnitTypeSupplies.json'

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
    this.logger.success('Started update:brandAndUnitTypeSupplies')
    try {
      if (this.rollbackCommand) {
        this.logger.success('Started rollback update:brandAndUnitTypeSupplies')
        await this.rollback()
      } else {
        await this.execute()
      }
    } catch (error) {
      this.logger.error(`Error Message: ${error.message}`)
      this.logger.error(`Error: ${error}`)
    }
    this.logger.logUpdatePersist()
    this.logger.success('Update brandAndUnitTypeSupplies')
  }

  public async execute(): Promise<void> {
    let i: number = 0
    let listBackup: Array<Object> = []

    for (const item of listActivities) {
      const activity = await ActivityRepository.findOnePopulate({
        _id: item.idActivity
      })
      //console.log(item.idActivity)
      if (activity) {
        const activityBackup = {
          activityId: activity._id,
          data: activity
        }
        listBackup.push(activityBackup)

        for (const supply of activity.supplies) {
          const supplyFind = await SupplyRepository.findOne({
            _id: supply.supply
          })

          if (supplyFind) {
            if (!supply.brand) {
              await ActivityRepository.findOneAndUpdate(
                {
                  _id: activity._id,
                  'supplies._id': supply._id
                },
                {
                  $set: {
                    ['supplies.$.brand']: supplyFind.brand
                  }
                }
              )
            }

            if (!supply.unitTypeSupply) {
              await ActivityRepository.findOneAndUpdate(
                {
                  _id: activity._id,
                  'supplies._id': supply._id
                },
                {
                  $set: {
                    ['supplies.$.unitTypeSupply']: supplyFind.unitTypeSupply
                  }
                }
              )
            }
          } else {
            this.logger.log(`Supply ${supply.supply} not found`)
            continue
          }
        }
      } else {
        this.logger.log(`Activity ${item.idActivity} not found`)
        continue
      }
      i = this.processingProgressBar(i, listActivities.length)
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
      await ActivityRepository.update(
        { _id: item.activityId },
        { $set: item.data }
      )

      i = this.processingProgressBar(i, data.length)
    }

    await StorageRepository.delete(this.nameFileBackup)
  }
}
