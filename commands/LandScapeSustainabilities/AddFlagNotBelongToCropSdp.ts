import { BaseCommand, flags } from '@adonisjs/core/build/standalone'
import LandscapeSustainabilityRepository from 'App/Core/LandscapeSustainability/Infrastructure/Mongoose/Repositories'

export default class AddFlagNotBelongToCropSdp extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName =
    'landscapesustainability:update:flag:notbelongtocrop'

  /**
   * Command description is displayed in the "help" output
   */
  public static description =
    'This command use to update flag not belong to crop sustainability'

  @flags.boolean({ alias: 'r', description: 'Rollback flag and assignable' })
  public rollbackCommand: boolean

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
    this.logger.success('Started update flag not belong to crop')
    try {
      if (this.rollbackCommand) {
        this.logger.success('Started rollback update flag not belong to crop')
        await this.rollback()
      } else {
        await this.execute()
      }
    } catch (error) {
      this.logger.error(`Error Message: ${error.message}`)
      this.logger.error(`Error: ${error}`)
    }
    this.logger.logUpdatePersist()
    this.logger.success('Finished update flag not belong to crop')
  }

  public async execute() {
    await LandscapeSustainabilityRepository.updateMany(
      {},
      { $set: { notBelongToCrop: false } }
    )
  }

  public async rollback() {
    await LandscapeSustainabilityRepository.updateMany(
      {},
      { $unset: { notBelongToCrop: 1 } }
    )
  }
}
