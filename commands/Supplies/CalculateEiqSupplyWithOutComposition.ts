import { BaseCommand, flags } from '@adonisjs/core/build/standalone'
import { SupplyDocument } from 'App/Core/Supply/Infrastructure/Mongoose/Interfaces'
import SupplyRepository from 'App/Core/Supply/Infrastructure/Mongoose/Repositories'

export default class CalculateEiqSupplyWithOutComposition extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'supply:calculate:eiq'
  private coefficientLiters: number = 0.855253
  private coefficientKilograms: number = 0.892179

  /**
   * Command description is displayed in the "help" output
   */
  public static description = 'This command calculate eiq in Supply'

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
    const supplies: SupplyDocument[] = await SupplyRepository.findAll({
      activeIngredients: { $exists: true, $type: 'array', $ne: [] }
    })
    // eslint-disable-next-line @typescript-eslint/naming-convention
    for await (const { activeIngredients, _id } of supplies) {
      for await (const activeIngredient of activeIngredients!) {
        const newEiq =
          (activeIngredient.eiqActiveIngredient *
            activeIngredient.composition) /
          100
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
   * Run command.
   */
  public async run() {
    this.logger.success('Started calculate Supply eiq')
    try {
      if (this.rollbackCommand) {
        this.logger.success('Started rollback calculate Supply eiq')
        await this.rollback()
      } else {
        await this.execute()
      }
    } catch (error) {
      this.logger.error(`Error Message: ${error.message}`)
      this.logger.error(`Error: ${error}`)
    }
    this.logger.logUpdatePersist()
    this.logger.success('calculate Supply eiq Success')
  }
}
