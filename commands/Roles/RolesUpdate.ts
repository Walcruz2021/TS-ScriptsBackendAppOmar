import { args, BaseCommand } from '@adonisjs/core/build/standalone'
import RolRepository from '@ioc:Ucropit/Core/RolRepository'

export default class RolesUpdate extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'roles:update'

  /**
   * Command description is displayed in the "help" output
   */
  public static description = 'This command use to update value data of roles'

  @args.string({ description: 'Identifier for search Rol will be updated' })
  public rol: string

  @args.string({ description: 'Attribute Rols will be updated' })
  public attribute: string

  @args.string({ description: 'New value' })
  public value: string

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
    try {
      const { modifiedCount } = await RolRepository.updateOne(
        { value: this.rol },
        { [this.attribute]: this.value }
      )
      if (modifiedCount > 0) {
        this.logger.success(`UPDATE VALUE ROL`)
      }
    } catch (error) {
      this.logger.error(`Error: ${error}`)
    }

    await this.exit()
  }
}
