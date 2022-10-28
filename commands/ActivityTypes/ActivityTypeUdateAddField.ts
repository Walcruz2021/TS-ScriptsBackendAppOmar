import { BaseCommand, flags } from '@adonisjs/core/build/standalone'
import { ActivityTypeRepositoryContract } from 'App/Core/ActivityType/Infrastructure/Contracts'
import ActivityTypeRepository from 'App/Core/ActivityType/Infrastructure/Mongoose/Repositories'
import StorageRepository from 'App/Core/Storage'
import { StorageContract } from 'App/Core/Storage/Contracts'
import { activityTypeWithCanPlanning } from '../../dataset/activityTypeWithCanPlanning'

export default class ActivityTypeUdateAddField extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'activityType:update:addField'

  /**
   * Command description is displayed in the "help" output
   */
  public static description = 'add field canPlanning in Activity Type'

  @flags.boolean({ alias: 'r', description: 'Rollback flag' })
  public rollbackCommand: boolean

  private nameFileBackup: string = 'activityType-update-addField.json'

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
   * ActivityTypeRepository
   */
  private activityTypeRepository: ActivityTypeRepositoryContract
  /**
   * StorageRepository
   */
  private storageRepository: StorageContract

  public async run() {
    this.logger.success('Started proccess')
    await this.setRepositories()
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
    this.logger.success('Proccess Success')
  }

  private async setRepositories(): Promise<void> {
    this.storageRepository = StorageRepository
    this.activityTypeRepository = ActivityTypeRepository
  }

  private async execute(): Promise<void> {
    try {
      let i: number = 0
      const listBackup: Array<Object> = []
      const activityTypes = await this.activityTypeRepository.findAll({})
      for (const activityType of activityTypes) {
        i = this.processingProgressBar(i, activityTypes.length)
        const lotBackup = {
          _id: activityType._id
        }
        listBackup.push(lotBackup)
        await this.activityTypeRepository.updateOne(
          {
            _id: activityType._id
          },
          {
            $set: {
              canPlanning: activityTypeWithCanPlanning.includes(
                activityType.tag
              )
            }
          }
        )
      }
      await this.storageRepository.create(listBackup, this.nameFileBackup)
    } catch (err) {
      this.logger.error(err.toString())
    }
  }

  public async rollback(): Promise<void> {
    let i: number = 0
    const data = await this.storageRepository.get(this.nameFileBackup)
    for (const item of data) {
      await this.activityTypeRepository.updateOne(
        {
          _id: item._id
        },
        { $unset: { canPlanning: '' } }
      )
      i = this.processingProgressBar(i, data.length)
    }

    await this.storageRepository.delete(this.nameFileBackup)
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
}
