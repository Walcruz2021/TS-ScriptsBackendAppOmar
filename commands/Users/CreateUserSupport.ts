import { BaseCommand } from '@adonisjs/core/build/standalone'
import UserRepository from 'App/Core/User/Infrastructure/Mongoose/Repositories'

export default class CreateUserSupport extends BaseCommand {
  public DEFAULT_EMAIL_USER: string = 'support@ucrop.it'

  /**
   * Command name is used to run the command
   */
  public static commandName = 'create:user:support'

  /**
   * Command description is displayed in the "help" output
   */
  public static description = ''

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

  private async execute() {
    const user = await UserRepository.findOne({
      email: this.DEFAULT_EMAIL_USER
    })
    if (user) {
      this.logger.error('Support user exist in DB!!')
      return
    }
    const userDTO = {
      email: this.DEFAULT_EMAIL_USER,
      companies: [],
      config: null
    }

    return await UserRepository.create(userDTO)
  }

  public async run() {
    await this.execute()
    this.logger.info('Finish process!')
  }
}
