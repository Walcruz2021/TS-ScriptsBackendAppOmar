import { BaseCommand, flags } from '@adonisjs/core/build/standalone'
import RolRepository from 'App/Core/Rol/Infrastructure/Mongoose/Repositories'
import { RolesDocument } from 'App/Core/Rol/Infrastructure/Interfaces'
import { roleAssignableCrop } from '../../dataset/roleAssignableCrop'
import StorageService from '../../app/Core/Storage/Services/StorageService'

export default class RolesUpdateAssignableCrop extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'roles:update:assignable:crop'

  /**
   * Command description is displayed in the "help" output
   */
  public static description =
    'Use command to update value in array assignableCrop in Roles'

  private nameFileBackup: string = 'roles-update-assignable-crop.json'

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

  private async updateRoleAssignable(role: RolesDocument) {
    try {
      const queryFilter: Object = { _id: role._id }
      const updateQuery: Object = { assignableCrop: role.assignableCrop }
      await RolRepository.updateOne(queryFilter, updateQuery)
    } catch (err) {
      this.logger.info('Error > updateCompaniesInUser')
      this.logger.error(err)
      await this.exit()
    }
  }

  public async execute(): Promise<void> {
    await StorageService.create([], this.nameFileBackup)
    const roles: RolesDocument[] = await RolRepository.findAll({})
    for (let index = 0; index < roles.length; index++) {
      const role = roles[index]
      const assignableCrop = role.value ? roleAssignableCrop[role.value] : null
      if (assignableCrop) {
        await StorageService.add(role, this.nameFileBackup)
        role.assignableCrop = assignableCrop
        await this.updateRoleAssignable(role)
      }
      this.processingProgressBar(index, roles.length)
    }
  }

  public async rollback(): Promise<void> {
    const roles = await StorageService.get(this.nameFileBackup)
    if (!roles && !roles.length) {
      this.logger.error(`Error: The rollBack data does not exist`)
      this.exit()
    }
    for (let index = 0; index < roles.length; index++) {
      const role = roles[index]
      await this.updateRoleAssignable(role)
      this.processingProgressBar(index, roles.length)
    }
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
