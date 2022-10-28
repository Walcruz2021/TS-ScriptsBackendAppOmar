import { BaseCommand, flags } from '@adonisjs/core/build/standalone'
import CropRepository from '@ioc:Ucropit/Core/CropRepository'
import StorageRepository from '@ioc:Ucropit/Core/StorageRepository'

export default class MemberUpdateCamKamAllCrops extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'member:update:cam:kam:all:crops'

  /**
   * Command description is displayed in the "help" output
   */
  public static description =
    'Use this command to find all crops with CAM type collaborators and replace it with KAM'

  @flags.boolean({ alias: 'r', description: 'Rollback flag' })
  public rollbackCommand: boolean

  private nameFileBackup: string = 'member-update-cam:kam-all-crops.json'

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
  private processingProgressBar(index: number, limit: number): number {
    if (index < limit) {
      index++
      this.logger.logUpdate(
        `Processing: ${this.getProgressBar((index * 100) / limit)} ${
          (index * 100) / limit
        }%`
      )
    }
    return index
  }

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

  public async run() {
    this.logger.info('Update value CAM for KAM')
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
    this.logger.success('Finish Update')
  }

  public async execute(): Promise<void> {
    let i: number = 0
    let listCropBackup: Array<Object> = []
    const crops = (
      await CropRepository.findAll({
        'members.type': 'CAM'
      })
    ).map((crop) => {
      return {
        id: crop._id
      }
    })
    for (const item of crops) {
      const crop = await CropRepository.findOne({ _id: item.id })
      const members = crop.members.filter((member) => member.type === 'CAM')

      for (const member of members) {
        const attributeUpdate = `members.$.type`
        const cropBackup = {
          cropId: crop._id,
          memberId: member._id,
          value: member.type
        }
        listCropBackup.push(cropBackup)
        await CropRepository.findOneAndUpdate(
          {
            _id: item.id,
            'members._id': member._id
          },
          { $set: { [attributeUpdate]: 'KAM' } }
        )
      }
      i = this.processingProgressBar(i, crops.length)
    }

    await StorageRepository.create(listCropBackup, this.nameFileBackup)
  }

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
      i = this.processingProgressBar(i, data.length)
    }

    await StorageRepository.delete(this.nameFileBackup)
  }
}
