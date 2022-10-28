import { BaseCommand, flags } from '@adonisjs/core/build/standalone'
import RolRepository from '@ioc:Ucropit/Core/RolRepository'
import { RolesDocument, ERoles } from 'App/Core/Rol/Infrastructure/Interfaces'
import { FlagRepository } from 'App/Core/Flag/Infrastructure/Mongoose/Repositories'
import {
  FlagDocument,
  EFlag
} from 'App/Core/Flag/Infrastructure/Mongoose/Interfaces'
export default class RolesCanMarkFlagUpdate extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'roles:can:mark:flag:update'

  /**
   * Command description is displayed in the "help" output
   */
  public static description =
    'Use command to update canMarkFlag and assignable values in roles for verifier'

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

  public async execute(): Promise<void> {
    const flagVerifier = await FlagRepository.findOne({
      key: EFlag.verifier_responsible
    })
    if (!flagVerifier) {
      this.logger.error('verifier flag not found')
      this.exit()
    }

    const kamRole: RolesDocument = await RolRepository.findOne({
      value: ERoles.KAM
    })
    const verifierRole: RolesDocument = await RolRepository.findOne({
      value: ERoles.VERIFIER
    })
    if (!kamRole || !verifierRole) {
      this.logger.error('roles not found')
      this.exit()
    }

    const queryFilter: Object = { _id: kamRole._id }
    const canMarkFlags = kamRole.canMarkFlags
    const hasFlagAlready = canMarkFlags.some(
      ({ flag }) => flag === flagVerifier.key
    )
    if (hasFlagAlready) {
      this.logger.error('flag already added')
      this.exit()
    }

    canMarkFlags.push({
      flag: flagVerifier.key,
      targetRoles: [verifierRole.value]
    })

    // update assignable properties
    const assignable = kamRole.assignable
    const hasAssignableAlready = assignable.some(
      (assignableRole: string) => assignableRole === verifierRole.value
    )
    if (hasAssignableAlready) {
      this.logger.error('assignable verifier role already added')
      this.exit()
    }

    assignable.push(verifierRole.value || ERoles.VERIFIER)

    const updateQuery: Object = {
      canMarkFlags: canMarkFlags,
      assignable
    }
    await RolRepository.updateOne(queryFilter, updateQuery)
  }

  public async rollback(): Promise<void> {
    const kamRole: RolesDocument = await RolRepository.findOne({
      value: ERoles.KAM
    })
    const verifierRole: RolesDocument = await RolRepository.findOne({
      value: ERoles.VERIFIER
    })
    const verifierFlag: FlagDocument = await FlagRepository.findOne({
      key: EFlag.verifier_responsible
    })
    const canMarkFlags = kamRole.canMarkFlags
    const assignable = kamRole.assignable
    const canMarkFlagsToUpdate = canMarkFlags.filter(
      ({ flag }) => flag !== verifierFlag.key
    )
    const assignableToUpdate = assignable.filter(
      (assignableRole) => assignableRole !== verifierRole.value
    )

    await RolRepository.updateOne(
      { _id: kamRole._id },
      { canMarkFlags: canMarkFlagsToUpdate, assignable: assignableToUpdate }
    )
  }

  public async run() {
    this.logger.info(
      `Init: Update canMarkFlags and assignable value for kam role`
    )
    try {
      if (this.rollbackCommand) {
        await this.rollback()
      } else {
        await this.execute()
      }

      this.logger.success(
        `Successfully: Update canMarkFlags and assignable value for kam role`
      )
    } catch (error) {
      this.logger.error(`Error Message: ${error.message}`)
      this.logger.error(`Error: ${error}`)
    }
  }
}
