import { BaseCommand, flags } from '@adonisjs/core/build/standalone'
import seedActivityTypeVerification from 'App/Core/ActivityType/Infrastructure/Mongoose/Seeders/addSeeder'
import ActivityTypeRepository from 'App/Core/ActivityType/Infrastructure/Mongoose/Repositories'
import { ActivityTypeRepositoryContract } from 'App/Core/ActivityType/Infrastructure/Contracts'

export default class SeedActivityTypes extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'seed:activityTypes'

  /**
   * Command description is displayed in the "help" output
   */
  public static description = 'add seed for Activity Type'

  @flags.boolean({ alias: 'r', description: 'Rollback flag' })
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

  private activityTypeRepository: ActivityTypeRepositoryContract

  private async execute(): Promise<void> {
    try {
      const activityTypeFound = await this.activityTypeRepository.findOne({
        tag: seedActivityTypeVerification.tag
      })
      if (activityTypeFound) {
        this.logger.warning(
          `Tag ${seedActivityTypeVerification.tag} exist in DB----`
        )
      } else {
        //insert in DB
        const elementInsert = await this.activityTypeRepository.create(
          seedActivityTypeVerification
        )
        this.logger.warning(
          `Insert Element :  ${JSON.stringify(elementInsert)} `
        )
      }
      this.logger.success('Proccess end ----')
    } catch (err) {
      this.logger.error(err.toString())
    }
  }

  private async setRepositories(): Promise<void> {
    this.activityTypeRepository = ActivityTypeRepository
  }

  private async rollback(): Promise<void> {
    await this.activityTypeRepository.deleteOne({
      tag: seedActivityTypeVerification.tag
    })
    this.logger.success(`Delete  ${seedActivityTypeVerification.tag}`)
  }

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
}
