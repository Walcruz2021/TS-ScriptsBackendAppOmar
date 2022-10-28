import { BaseCommand } from '@adonisjs/core/build/standalone'
import {
  convertUnits,
  convertPay,
  convertSupplyUnits
} from '@ucropit/unit-system'
import { validateInput } from 'App/utils'

export default class UnitSystemConverter extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'unit:system_converter'

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

  private async execute(): Promise<void> {
    const convertionMethod = await this.prompt.ask(
      'Enter convertion method: (pay, supply, normal)',
      {
        validate: validateInput
      }
    )
    const quantity: number = await this.prompt.ask(
      'Enter quantity to convert',
      {
        validate: validateInput
      }
    )
    const fromUnit: string = await this.prompt.ask(
      'Enter the unit of quantity',
      {
        validate: validateInput
      }
    )
    switch (convertionMethod) {
      case 'pay':
        this.logger.info(
          'Convert pay units from metric system to imperial and vice versa'
        )
        const equivalence: number = await this.prompt.ask(
          'Enter the equivalence number (only for kg/ha and bu/ac)'
        )
        try {
          const result = equivalence
            ? convertPay(quantity, fromUnit, Number(equivalence))
            : convertPay(quantity, fromUnit)
          this.logger.success(`Convertion Success:`)
          this.logger.info(`quantity: ${result.quantity} unit: ${result.unit}`)
        } catch (error) {
          this.logger.error(error.toString())
        }
        break
      case 'supply':
        this.logger.info('Convert supply units')
        try {
          const result = convertSupplyUnits(quantity, fromUnit)
          this.logger.success(`Convertion Success:`)
          this.logger.info(`quantity: ${result.quantity} unit: ${result.unit}`)
        } catch (error) {
          this.logger.error(error.toString())
        }
        break
      case 'normal':
        this.logger.info('Convert normal units')
        const toUnit: string = await this.prompt.ask(
          'Enter the unit to convert',
          {
            validate: validateInput
          }
        )
        try {
          const result = convertUnits(Number(quantity), fromUnit, toUnit)
          this.logger.success(`Convertion Success:`)
          this.logger.info(`quantity: ${result}`)
        } catch (error) {
          this.logger.error(error.toString())
        }
        break

      default:
        this.logger.error('Convertion method not found')
        break
    }
  }

  public async run() {
    this.logger.info('Started unit converter')
    await this.execute()
    this.logger.logUpdatePersist()
  }
}
