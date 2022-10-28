import { BaseCommand, flags } from '@adonisjs/core/build/standalone'
import { existsSync } from 'fs'
import { rolPermissions } from '../../dataset/rolPermissions'
import RolRepository from 'App/Core/Rol/Infrastructure/Mongoose/Repositories'
import StorageRepository from 'App/Core/Storage'
const NONE_ROL = 'NONE'
export default class RolesUpdate extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'roles:update:permissions'

  /**
   * Command description is displayed in the "help" output
   */
  public static description =
    'This command use to update value data of roles with permissions'

  private nameFileBackup: string = 'roles-update-permissions.json'

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

  public async rollback(): Promise<void> {
    let i: number = 0
    const rolesDataSet = rolPermissions.map((rol) => rol.value)
    rolesDataSet.push(NONE_ROL)
    const selectedRolName = await this.prompt.choice(
      'Select the role to rollback',
      rolesDataSet
    )
    if (selectedRolName === NONE_ROL) {
      this.exit()
    }
    const filePath = await StorageRepository.getPath(this.nameFileBackup)
    if (!existsSync(filePath)) {
      this.logger.error(`Error: The rollBack file does not exist`)
      this.exit()
    }

    const data = await StorageRepository.get(this.nameFileBackup)
    if (typeof data === 'object' && !data[selectedRolName]) {
      this.logger.error(
        `Error: The rollBack for role ${selectedRolName} does not exist`
      )
      this.exit()
    }
    const roles = data[selectedRolName]
    for (const rol of roles) {
      i = this.processingProgressBar(i, roles.length)
      const query = {
        _id: rol._id
      }
      if (rol.isCreated) {
        await RolRepository.deleteOne(query)
        continue
      }
      // @ts-ignore
      await RolRepository.replaceOne(query, rol)
    }
  }

  public async execute(): Promise<void> {
    const resultsBack: any[] = []
    const rolesDataSet = rolPermissions.map((rol) => rol.value)
    rolesDataSet.push(NONE_ROL)
    const selectedRolName = await this.prompt.choice(
      'Select the new role with permissions to create',
      rolesDataSet
    )
    if (selectedRolName === NONE_ROL) {
      await this.exit()
    }
    const rolDataSet = rolPermissions.find(
      (rol) => rol.value === selectedRolName
    )
    let rol = await RolRepository.findOne({ value: selectedRolName })
    if (!rol) {
      rol = await RolRepository.create(rolDataSet)
      resultsBack.push({
        ...rol,
        isCreated: true
      })
    } else {
      resultsBack.push(rol)
      await RolRepository.updateOne({ _id: rol._id }, { $set: rolDataSet })
    }

    let data = {}
    const filePath = await StorageRepository.getPath(this.nameFileBackup)
    if (existsSync(filePath)) {
      data = await StorageRepository.get(this.nameFileBackup)
    }
    data[selectedRolName] = resultsBack
    await StorageRepository.create(data, this.nameFileBackup)
  }

  public async run() {
    this.logger.success('Started create o update rol with permissions')
    try {
      if (this.rollbackCommand) {
        this.logger.success('Started rollback roles')
        await this.rollback()
      } else {
        await this.execute()
      }
    } catch (error) {
      this.logger.error(`Error Message: ${error.message}`)
      this.logger.error(`Error: ${error}`)
    }
    this.logger.logUpdatePersist()
    this.logger.success('Started create o update rol with permissions Success')
  }
}
