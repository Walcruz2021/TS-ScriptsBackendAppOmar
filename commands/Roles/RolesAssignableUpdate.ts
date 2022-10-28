import { BaseCommand, flags } from '@adonisjs/core/build/standalone'
import RolRepository from '@ioc:Ucropit/Core/RolRepository'
import StorageRepository from '@ioc:Ucropit/Core/StorageRepository'
import { RolesDocument } from 'App/Core/Rol/Infrastructure/Interfaces'

export default class RolesAssignableUpdate extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'roles:assignable:canMarkFlags:update'

  /**
   * Command description is displayed in the "help" output
   */
  public static description =
    'Use command to update value in array assignable in Roles'

  /**
   * Name file backup command
   */
  private nameFileBackup: string = 'roles-assignable-update.json'

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

  public async execute(): Promise<void> {
    const listRoles: Array<{
      roleId: String
      assignable: Array<String>
      canMarkFlags?: Array<Object>
    }> = []
    const roles: RolesDocument[] = await RolRepository.findAll({})
    for (const rol of roles) {
      const assignable = rol.assignable.map((item) =>
        item === 'CAM' ? 'KAM' : item
      )
      const canMarkFlags = rol?.toJSON().canMarkFlags.map((item: any) => {
        return {
          ...item,
          targetRoles: item?.targetRoles.map((rol) =>
            rol === 'CAM' ? 'KAM' : rol
          )
        }
      })
      const backup: any = {
        roleId: rol._id,
        assignable: rol.assignable
      }

      if (rol?.toJSON().canMarkFlags) {
        backup.canMarkFlags = rol?.toJSON().canMarkFlags
      }

      listRoles.push(backup)
      const queryFilter: Object = { _id: rol._id }
      const updateQuery: Object = canMarkFlags.length
        ? { assignable, canMarkFlags }
        : { assignable }
      await RolRepository.updateOne(queryFilter, updateQuery)
    }

    await StorageRepository.create(listRoles, this.nameFileBackup)
  }

  public async rollback(): Promise<void> {
    const data = await StorageRepository.get(this.nameFileBackup)
    for (const rol of data) {
      await RolRepository.updateOne(
        { _id: rol.roleId },
        { assignable: rol.assignable, canMarkFlags: rol.canMarkFlags }
      )
    }
    await StorageRepository.delete(this.nameFileBackup)
  }

  public async run() {
    this.logger.info(`Init: Update value assignable`)
    try {
      if (this.rollbackCommand) {
        await this.rollback()
      } else {
        await this.execute()
      }

      this.logger.success(`Successfully: Update value assignable`)
    } catch (error) {
      this.logger.error(`Error Message: ${error.message}`)
      this.logger.error(`Error: ${error}`)
    }
  }
}
