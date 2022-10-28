import { BaseCommand, flags } from '@adonisjs/core/build/standalone'

export default class RemoveCropMembersDuplicated extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'crop:removeMembersDuplicated'

  /**
   * Command description is displayed in the "help" output
   */
  public static description =
    'This command use to remove duplicated members of crop'

  @flags.boolean({ alias: 'r', description: 'Rollback flag' })
  public rollbackCommand: boolean

  private nameFileBackup: string = 'remove-crop-members-duplicated.json'

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
    const { default: StorageRepository } = await import(
      '@ioc:Ucropit/Core/StorageRepository'
    )
    const { default: CropRepository } = await import(
      '@ioc:Ucropit/Core/CropRepository'
    )

    let i = 0

    const crops = await CropRepository.findAll({})

    await StorageRepository.create(crops, this.nameFileBackup)

    for (const crop of crops) {
      const newMembers: Object[] = []

      for (const member of crop.members) {
        if (!newMembers.length) {
          newMembers.push(member)

          continue
        }

        if (
          !newMembers.find(
            (element: any) =>
              element.user?.toString() === member.user?.toString()
          )
        ) {
          newMembers.push(member)
        }
      }

      if (crop.members.length !== newMembers.length) {
        await CropRepository.findOneAndUpdate(
          {
            _id: crop.id
          },
          {
            $set: {
              members: newMembers
            }
          }
        )
      }

      i = this.processingProgressBar(i)
    }
  }

  /**
   * Rollback Command
   */
  public async rollback(): Promise<void> {
    const { default: StorageRepository } = await import(
      '@ioc:Ucropit/Core/StorageRepository'
    )
    const { default: CropRepository } = await import(
      '@ioc:Ucropit/Core/CropRepository'
    )

    let i: number = 0

    const data = await StorageRepository.get(this.nameFileBackup)

    for (const crop of data) {
      await CropRepository.findOneAndUpdate(
        {
          _id: crop._id
        },
        {
          $set: {
            ...crop
          }
        }
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
