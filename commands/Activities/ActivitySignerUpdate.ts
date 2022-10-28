import { args, BaseCommand, flags } from '@adonisjs/core/build/standalone'
import ActivityRepository from '@ioc:Ucropit/Core/ActivityRepository'
import StorageRepository from '@ioc:Ucropit/Core/StorageRepository'
import { Signer } from 'App/Core/Signer/Infrastructure/Mongoose/Interfaces'
import { ActivityDocument } from 'App/Core/Activity/Infrastructure/Mongoose/Interfaces/Activity.interface'

export default class ActivitySignerUpdate extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'activity:signer:update'

  /**
   * Command description is displayed in the "help" output
   */
  public static description =
    'Use this command to update data within the signer array'

  @args.string({ description: 'Attribute Signer will be updated' })
  public attribute: string

  @args.string({ description: 'Attribute Signer search update' })
  public search: string

  @args.string({ description: 'New value' })
  public value: string

  @flags.boolean({ alias: 'r', description: 'Rollback flag' })
  public rollbackCommand: boolean

  private nameFileBackup: string = 'activity-signer-update.json'

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
    this.logger.success('Started Update Signer')
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
    this.logger.success('Update Signer')
  }

  /**
   * Execute Command
   */
  public async execute(): Promise<void> {
    let i: number = 0
    let listActivityBackup: Array<Object> = []
    let activity: ActivityDocument
    const cursor = await ActivityRepository.findByCursor({
      [`signers.${this.attribute}`]: this.search
    })
    const countAchievement: number = await ActivityRepository.count({
      [`signers.${this.attribute}`]: this.search
    })

    while ((activity = await cursor.next())) {
      const signers: Signer[] = activity.signers.filter(
        (signer) => signer[this.attribute] === this.search
      )
      if (signers.length) {
        for (const signer of signers) {
          const activityBackup = {
            activityId: activity._id,
            signerId: signer._id,
            attribute: this.attribute,
            value: this.search
          }

          listActivityBackup.push(activityBackup)

          await ActivityRepository.findOneAndUpdate(
            {
              _id: activity._id,
              'signers._id': signer._id
            },
            { $set: { [`signers.$.${this.attribute}`]: this.value } }
          )
        }
      }

      i = this.processingProgressBar(i, countAchievement)
    }
    await StorageRepository.create(listActivityBackup, this.nameFileBackup)
  }

  /**
   * Rollback Command
   */
  public async rollback(): Promise<void> {
    let i: number = 0
    const data = await StorageRepository.get(this.nameFileBackup)

    for (const item of data) {
      await ActivityRepository.findOneAndUpdate(
        {
          _id: item.activityId,
          'signers._id': item.signerId
        },
        { $set: { [`signers.$.${item.attribute}`]: item.value } }
      )
      i = this.processingProgressBar(i, data.length)
    }

    await StorageRepository.delete(this.nameFileBackup)
  }
}
