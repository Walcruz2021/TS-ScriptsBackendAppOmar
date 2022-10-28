import { BaseCommand, flags } from '@adonisjs/core/build/standalone'
import { SupplyDocument } from 'App/Core/Supply/Infrastructure/Mongoose/Interfaces'
// import SupplyRepository from '@ioc:Ucropit/Core/SupplyRepository'

export default class UpdateEiqSupply extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'supply:update:eiq'
  private coefficientLiters: number = 0.855253
  private coefficientKilograms: number = 0.892179

  /**
   * Command description is displayed in the "help" output
   */
  public static description = 'This command update eiq in Supply'

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
  /**
   * Execute method command.
   */
  private async execute(): Promise<void> {
    const { default: SupplyRepository } = await import(
      '@ioc:Ucropit/Core/SupplyRepository'
    )
    const supplies: SupplyDocument[] = await SupplyRepository.findAll({
      activeIngredients: { $exists: true, $type: 'array', $ne: [] }
    })
    // eslint-disable-next-line @typescript-eslint/naming-convention
    for await (const { unit, activeIngredients, _id } of supplies) {
      for await (const activeIngredient of activeIngredients!) {
        const newEiq =
          activeIngredient.eiq *
          (unit === 'Lts' ? this.coefficientLiters : this.coefficientKilograms)
        await SupplyRepository.findOneAndUpdate(
          {
            _id,
            'activeIngredients._id': activeIngredient._id
          },
          { $set: { 'activeIngredients.$.eiq': newEiq } }
        )
      }
    }
  }

  /**
   * Rollback command
   */
  private async rollback(): Promise<void> {
    const { default: SupplyRepository } = await import(
      '@ioc:Ucropit/Core/SupplyRepository'
    )
    const supplies: SupplyDocument[] = await SupplyRepository.findAll({
      activeIngredients: { $exists: true, $type: 'array', $ne: [] }
    })
    // eslint-disable-next-line @typescript-eslint/naming-convention
    for await (const { unit, activeIngredients, _id } of supplies) {
      for await (const activeIngredient of activeIngredients!) {
        const newEiq =
          activeIngredient.eiq /
          (unit === 'Lts' ? this.coefficientLiters : this.coefficientKilograms)
        await SupplyRepository.findOneAndUpdate(
          {
            _id,
            'activeIngredients._id': activeIngredient._id
          },
          { $set: { 'activeIngredients.$.eiq': newEiq } }
        )
      }
    }
  }
  /**
   * Run command.
   */
  public async run() {
    this.logger.success('Started Update Supply eiq')
    try {
      if (this.rollbackCommand) {
        this.logger.success('Started rollback Update Supply eiq')
        await this.rollback()
      } else {
        await this.execute()
      }
    } catch (error) {
      this.logger.error(`Error Message: ${error.message}`)
      this.logger.error(`Error: ${error}`)
    }
    this.logger.logUpdatePersist()
    this.logger.success('Update Supply eiq Success')
  }
}
