import { BaseCommand } from '@adonisjs/core/build/standalone'
import {
  calculateEIQWithList,
  IEiqListDTO,
  getUnits
} from '@ucropit/eiq-calculator'
import { validateInput } from 'App/utils'

export default class EiqCalculator extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'eiq:calculator'

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

  /**
   * Execute method command.
   */
  private async execute(): Promise<void> {
    const surface = await this.prompt.ask('Enter the surface', {
      validate: validateInput
    })
    const eiqList: IEiqListDTO[] = await this.getEiqList()
    const decimal = await this.prompt.ask('Enter the decimal (Optional)')
    try {
      const result = calculateEIQWithList(
        Number(surface),
        eiqList,
        Number(decimal ?? Number.MAX_VALUE)
      )
      this.logger.info(`Eiq: ${result}`)
    } catch (err) {
      this.logger.error(err.toString())
    }
  }

  public async run() {
    this.logger.success('Started Eiq Calculator')
    await this.execute()
    this.logger.logUpdatePersist()
  }
  private async getEiqList(): Promise<IEiqListDTO[]> {
    let next = true
    let i = 1
    const eiqList: IEiqListDTO[] = []
    const unitsList = getUnits().filter((unit) => unit.indexOf('/') !== -1)
    while (next) {
      this.logger.info(`Enter Eiq and Total - Item: ${i}`)
      const eiq = await this.prompt.ask('Enter the eiq', {
        validate: validateInput
      })
      const total = await this.prompt.ask('Enter the total', {
        validate: validateInput
      })
      const unit = await this.prompt.choice('Select unit of measure', unitsList)
      eiqList.push({
        eiq: Number(eiq),
        total: Number(total),
        unit
      })
      i++
      next = await this.prompt.toggle('You want to add another item?', [
        'Yes',
        'Not'
      ])
    }

    return eiqList
  }
}
