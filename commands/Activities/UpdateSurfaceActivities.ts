import { BaseCommand, flags } from '@adonisjs/core/build/standalone'
import { StorageContract } from 'App/Core/Storage/Contracts'
import ActivityRepository from 'App/Core/Activity/Infrastructure/Mongoose/Repositories'

import StorageRepository from 'App/Core/Storage'


export default class UpdateSurfaceActivities extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'update:surface:activities'

  /**
   * Command description is displayed in the "help" output
   */
  public static description = 'This command update surface in activities'
  @flags.boolean({ alias: 'r', description: 'Rollback flag' })
  public rollbackCommand: boolean

  private nameFileBackup: string = 'activity-update-surface.json'
  private storageRepo: StorageContract
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

  private async setRepositories() {
    const { default: StorageRepository } = await import(
      '@ioc:Ucropit/Core/StorageRepository'
    )

    this.storageRepo = StorageRepository
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
    this.logger.success('Started Update Surface in activities')
    await this.setRepositories()
    try {
      if (this.rollbackCommand) {
        this.logger.success('Started rollback Update Surface in activities')
        await this.rollback()
      } else {
        await this.execute()
      }
    } catch (error) {
      this.logger.error(`Error Message: ${error.message}`)
      this.logger.error(`Error: ${error}`)
    }
    this.logger.logUpdatePersist()
    this.logger.success('Update Surface in activities Success')
  }

  public async execute(): Promise<void> {
    let i: number = 0
    let listBackup: Array<Object> = []
    const activities = await ActivityRepository.findAllWithLots({ surface: 0 })

    for (const activity of activities) {
      let surface = 0
      const activityBackup = {
        activityId: activity._id
      }
      listBackup.push(activityBackup)

      surface = this.calculateSurface(activity.lots)

      await ActivityRepository.findOneAndUpdate(
        {
          _id: activity._id
        },
        { surface: surface }
      )
      i = this.processingProgressBar(i, activities.length)
    }

    await this.storageRepo.create(listBackup, this.nameFileBackup)
  }

  /**
   * Rollback Command
   */
  public async rollback(): Promise<void> {
    let i: number = 0
    const data = await this.storageRepo.get(this.nameFileBackup)

    for (const item of data) {
      await ActivityRepository.findOneAndUpdate(
        {
          _id: item.activityId
        },
        { surface: 0 }
      )

      i = this.processingProgressBar(i, data.length)
    }

    await this.storageRepo.delete(this.nameFileBackup)
  }

  private calculateSurface(lots: any[]) {
    let surface = 0

    for (const lot of lots) {
      surface += lot.surface
    }

    return surface
  }
}
