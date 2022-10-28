import BsonOID from 'bson-objectid'
import { BaseCommand, flags } from '@adonisjs/core/build/standalone'
import {
  ActivityDocument,
  Supplies
} from 'App/Core/Activity/Infrastructure/Mongoose/Interfaces'
import { ActivityRepositoryContract } from 'App/Core/Activity/Infrastructure/Contracts'
import { StorageContract } from 'App/Core/Storage/Contracts'

export default class ActivitySupplyUpdate extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'activity:supply:update:id'

  /**
   * Command description is displayed in the "help" output
   */
  public static description =
    'This command allows updating data of the list of supplies within the activities'

  /**
   * Command rollback flag
   */
  @flags.boolean({ alias: 'r', description: 'Rollback flag' })
  public rollbackCommand: boolean

  /**
   * Name file backup
   */
  private nameFileBackup = 'activities-supplies-update-id.json'

  /**
   * ActivityRepository
   */
  private activityRepo: ActivityRepositoryContract

  /**
   * StorageRepository
   */
  private storageRepo: StorageContract

  /**
   * Settings Command.
   */
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
   * @param number limit
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
   * Set Repositories to use command.
   */
  private async setRepositories(): Promise<void> {
    const { default: ActivityRepository } = await import(
      '@ioc:Ucropit/Core/ActivityRepository'
    )
    const { default: StorageRepository } = await import(
      '@ioc:Ucropit/Core/StorageRepository'
    )

    this.activityRepo = ActivityRepository
    this.storageRepo = StorageRepository
  }

  /**
   * Execute command.
   */
  private async execute(): Promise<void> {
    let activity
    let index = 0
    let listActivityBackup: Array<Object> = []
    const query = {
      supplies: { $ne: [] }
    }
    const cursor: Iterator<ActivityDocument> =
      await this.activityRepo.findByCursor(query)
    const countDocument: number = await this.activityRepo.count(query)
    while ((activity = await cursor.next())) {
      const supplies: Supplies[] = this.getSuppliesWithIdEqualSupplyId(
        activity.supplies
      )
      if (supplies.length) {
        for (const supply of supplies) {
          const objectId = new BsonOID()
          const achievementBackup = {
            activityId: activity._id,
            supplyOld: supply._id,
            supplyId: objectId
          }
          listActivityBackup.push(achievementBackup)
          await this.updateIdSupplies(activity, supply, objectId)
        }
      }
      index = this.processingProgressBar(index, countDocument)
    }

    await this.storageRepo.create(listActivityBackup, this.nameFileBackup)
  }

  /**
   * Rollback command.
   */
  private async rollback(): Promise<void> {
    let index = 0
    const data = await this.storageRepo.get(this.nameFileBackup)
    for (const item of data) {
      const achievement = await this.activityRepo.findOne({
        _id: item.activityId
      })
      await this.updateIdSuppliesRollback(
        achievement,
        item.supplyId,
        item.supplyOld
      )
      index = this.processingProgressBar(index, data.length)
    }
    await this.storageRepo.delete(this.nameFileBackup)
  }

  public async run() {
    await this.setRepositories()

    if (this.rollbackCommand) {
      this.logger.info('Execute Command rollback')
      await this.rollback()
    } else {
      this.logger.info('Execute Command')
      await this.execute()
    }
  }

  /**
   * Update supply id applied.
   *
   * @param achievement
   * @param supply
   * @param objectId
   */
  private async updateIdSupplies(
    activity: ActivityDocument,
    supply: Supplies,
    objectId: BsonOID
  ): Promise<void> {
    await this.activityRepo.findOneAndUpdate(
      {
        _id: activity._id,
        'supplies._id': supply._id
      },
      { $set: { 'supplies.$._id': objectId.toString() } }
    )
  }

  /**
   * Rollback update Method
   *
   * @param achievement
   * @param supply
   * @param objectId
   */
  private async updateIdSuppliesRollback(
    activityId: string,
    supplyId: string,
    objectId: string
  ): Promise<void> {
    await this.activityRepo.findOneAndUpdate(
      {
        _id: activityId,
        'supplies._id': supplyId
      },
      { $set: { 'supplies.$._id': objectId } }
    )
  }

  /**
   * Get list supplies with id supply and id supply applied equal.
   *
   * @param supplies
   * @returns
   */
  private getSuppliesWithIdEqualSupplyId(
    supplies: Array<Supplies | any>
  ): Supplies[] {
    return supplies
      .map((supply) => {
        if (
          supply._id &&
          supply.supply &&
          supply._id.toString() === supply.supply.toString()
        ) {
          return supply
        }
      })
      .filter((supply) => supply)
  }
}
