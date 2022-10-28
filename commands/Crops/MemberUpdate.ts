import { BaseCommand, args, flags } from '@adonisjs/core/build/standalone'
import CropRepository from '@ioc:Ucropit/Core/CropRepository'
import StorageRepository from '@ioc:Ucropit/Core/StorageRepository'
import { listCrops } from '../../dataset/crops'

export default class MemberUpdate extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'member:update'

  /**
   * Command description is displayed in the "help" output
   */
  public static description =
    'This command use to update value data of member into array or list in crops change'

  @args.string({ description: 'Attribute Member will be updated' })
  public attribute: string

  @args.string({ description: 'Attribute Member search update' })
  public search: string

  @args.string({ description: 'New value' })
  public value: string

  @flags.boolean({ alias: 'r', description: 'Rollback flag' })
  public rollbackCommand: boolean

  private nameFileBackup: string = 'member-update.json'

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
   * Execute Command
   */
  public async execute(): Promise<void> {
    let i = 0
    let listCropBackup: Array<Object> = []
    for (const item of listCrops) {
      const crop = await CropRepository.findOne({ _id: item.id })
      if (crop) {
        const members = crop.members.filter(
          (member) => member[this.attribute] === this.search
        )

        for (const member of members) {
          const attributeUpdate = `members.$.${this.attribute}`
          const cropBackup = {
            cropId: crop._id,
            memberId: member._id,
            value: this.search
          }
          listCropBackup.push(cropBackup)
          await CropRepository.findOneAndUpdate(
            {
              _id: item.id,
              'members._id': member._id
            },
            { $set: { [attributeUpdate]: this.value } }
          )
        }

        await StorageRepository.create(listCropBackup, this.nameFileBackup)
      }

      i = this.processingProgressBar(i)
    }
  }

  /**
   * Rollback Command
   */
  public async rollback(): Promise<void> {
    let i: number = 0
    const data = await StorageRepository.get(this.nameFileBackup)

    for (const item of data) {
      await CropRepository.findOneAndUpdate(
        {
          _id: item.cropId,
          'members._id': item.memberId
        },
        { $set: { 'members.$.type': item.value } }
      )
      i = this.processingProgressBar(i)
    }

    await StorageRepository.delete(this.nameFileBackup)
  }

  public async run() {
    try {
      this.logger.info('Start Process Update Member Data')
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
    this.logger.success('Update Members data')
  }
}
