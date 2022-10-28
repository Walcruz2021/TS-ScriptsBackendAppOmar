import BsonOID from 'bson-objectid'
import { BaseCommand, flags } from '@adonisjs/core/build/standalone'
import {
  AchievementDocument,
  Supplies,
  SuppliesMapper
} from 'App/Core/Achievement/Infrastructure/Mongoose/Interfaces/Achievement.interface'
import { StorageContract } from 'App/Core/Storage/Contracts'
import { AchievementRepositoryContract } from 'App/Core/Achievement/Infrastructure/Contracts'

export default class AchievementSupplyUpdate extends BaseCommand {
  /**
   * achievementRepository
   */
  private achievementRepository: AchievementRepositoryContract

  /**
   * StorageRepository
   */
  private storageRepository: StorageContract
  /**
   * Command name is used to run the command
   */
  public static commandName = 'achievement:supplies:update:id'

  /**
   * Command description is displayed in the "help" output
   */
  public static description =
    'This command allows updating data of the list of supplies within the realizations'

  @flags.boolean({ alias: 'r', description: 'Rollback flag' })
  public rollbackCommand: boolean

  private nameFileBackup: string = 'achievement-supplies-update-id.json'

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

  private getProgressBar(currentPercentage: number) {
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
   * @returns
   */
  private processingProgressBar(index: number): number {
    if (index < 100) {
      index++
      this.logger.logUpdate(
        `Processing: ${this.getProgressBar(index)} ${index}%`
      )
    }
    return index
  }

  /**
   * Set Repositories to use command.
   */
  private async setRepositories(): Promise<void> {
    const { default: AchievementRepository } = await import(
      '@ioc:Ucropit/Core/AchievementRepository'
    )
    const { default: StorageRepository } = await import(
      '@ioc:Ucropit/Core/StorageRepository'
    )

    this.achievementRepository = AchievementRepository
    this.storageRepository = StorageRepository
  }

  /**
   * Execute method command.
   */
  private async execute(): Promise<void> {
    let achievement
    let i = 0
    let listAchievementBackup: Array<Object> = []
    const cursor = await this.achievementRepository.findByCursor({})
    while ((achievement = await cursor.next())) {
      const supplies: SuppliesMapper[] = this.getSuppliesWithIdEqualSupplyId(
        achievement.supplies
      )
      console.log(supplies)
      if (supplies.length) {
        for (const supply of supplies) {
          const objectId = new BsonOID()
          const achievementBackup = {
            achievementId: achievement._id,
            supplyOld: supply._id,
            supplyId: objectId
          }
          listAchievementBackup.push(achievementBackup)
          await this.updateIdSupplies(achievement, supply, objectId)
        }
      }
      i = this.processingProgressBar(i)
    }
    await this.storageRepository.create(
      listAchievementBackup,
      this.nameFileBackup
    )
  }

  /**
   * Rollback command
   */
  private async rollback(): Promise<void> {
    let i = 0
    const data = await this.storageRepository.get(this.nameFileBackup)
    for (const item of data) {
      const achievement = await this.achievementRepository.findOne({
        _id: item.achievementId
      })
      await this.updateIdSuppliesRollback(
        achievement,
        item.supplyId,
        item.supplyOld
      )
      i = this.processingProgressBar(i)
    }
    await this.storageRepository.delete(this.nameFileBackup)
  }

  /**
   * Run command.
   */
  public async run() {
    await this.setRepositories()
    this.logger.success('Started Supplies Ids')
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
    this.logger.success('Update Supplies Ids')
  }

  /**
   * Update supply id applied.
   *
   * @param achievement
   * @param supply
   * @param objectId
   */
  public async updateIdSupplies(
    achievement: AchievementDocument,
    supply: Supplies,
    objectId: BsonOID
  ): Promise<void> {
    await this.achievementRepository.findOneAndUpdate(
      {
        _id: achievement._id,
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
  public async updateIdSuppliesRollback(
    achievementId: string,
    supplyId: string,
    objectId: string
  ): Promise<void> {
    await this.achievementRepository.findOneAndUpdate(
      {
        _id: achievementId,
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
  public getSuppliesWithIdEqualSupplyId(
    supplies: Array<Supplies | any>
  ): SuppliesMapper[] {
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
