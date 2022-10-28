import { BaseCommand, flags } from '@adonisjs/core/build/standalone'
import NormativeConfigRepository from 'App/Core/NormativeConfig/Infrastructure/Mongoose/Repositories'
import CropTypeRepository from 'App/Core/CropType/Infraestructure/Mongoose/Repositories'
import {
  AlphaCode,
  Normative,
  AlphaCodeNameCountry
} from 'App/Core/NormativeConfig/enums'
import moment from 'moment'
import { string } from '@ioc:Adonis/Core/Helpers'

export default class NormativeConfig extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'normative:config:create'

  /**
   * Command description is displayed in the "help" output
   */
  public static description = 'Create new normative config'

  @flags.boolean({ alias: 'r', description: 'Rollback flag' })
  public rollbackCommand: boolean

  @flags.boolean({ alias: 'n', description: 'List Normatives list' })
  public normatives: boolean

  @flags.boolean({ alias: 'a', description: 'List Alphacodes list' })
  public alphacodes: boolean

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
    try {
      let cropTypeList = []
      const cropTypes = await CropTypeRepository.findAll({})
      const cropTypesEnum = this.getCropTypeEnum(cropTypes)
      const normative = await this.prompt.ask('Enter the normative to create', {
        validate: this.validateNormative
      })
      const alpha3Code = await this.prompt.ask(
        'Enter alpha3code from country to belong normative',
        {
          validate: this.validateAlphaCode
        }
      )
      const dateReference = await this.prompt.ask(
        "Enter the normative's date reference",
        {
          validate: this.validateDate
        }
      )

      const typeCropTypeMode = await this.prompt.choice(
        'Choose an option to save crop types',
        [
          { name: 'LIST', message: 'Choose crop types' },
          { name: 'ALL', message: 'Choose all crop types' }
        ]
      )

      if (typeCropTypeMode === 'ALL') {
        cropTypeList = this.getCropTypesKey(cropTypes)
      } else {
        cropTypeList = await this.prompt.multiple(
          'Select type company',
          cropTypesEnum
        )
      }

      const normativeConfig = await NormativeConfigRepository.findOne({
        normative: normative,
        alphaCode: alpha3Code,
        generalCountryNormative: true
      })

      if (normativeConfig) {
        this.logger.error(`Normative: ${normative} is already exist`)
        await this.exit()
      }

      await NormativeConfigRepository.create({
        cropsType: cropTypeList,
        alphaCode: alpha3Code,
        normative: normative,
        dateReference: dateReference,
        generalCountryNormative: true
      })

      this.logger.success(`Normative: ${normative} is created`)
    } catch (error) {
      this.logger.error(`Error Message: ${error.message}`)
      this.logger.error(`Error: ${error}`)
      await this.exit()
    }
  }

  public normativeList(): void {
    const table = this.ui.table()
    table.head(['Normative', 'Description'])
    table.columnWidths([20, 40])
    const normatives = Object.keys(Normative).map((key) => {
      return {
        key: `${Normative[key]}`,
        description: `Normative General Country ${Normative[key]}`
      }
    })

    for (const item of normatives) {
      table.row([item.key, item.description])
    }

    table.render()
  }

  public alphaCodeList(): void {
    const table = this.ui.table()
    table.head(['Alpha3Code', 'Description'])
    table.columnWidths([20, 40])
    const alphacodes = Object.keys(AlphaCode).map((key) => {
      return {
        key: `${AlphaCode[key]}`,
        description: `Alpha code from country ${AlphaCodeNameCountry[key]}`
      }
    })

    for (const item of alphacodes) {
      table.row([item.key, item.description])
    }

    table.render()
  }

  public async run() {
    try {
      if (this.normatives) {
        this.normativeList()
      } else if (this.alphacodes) {
        this.alphaCodeList()
      } else {
        await this.execute()
      }
    } catch (error) {
      this.logger.error(`Error Message: ${error.message}`)
      this.logger.error(`Error: ${error}`)
      await this.exit()
    }
  }

  private getCropTypeEnum(cropTypes) {
    return cropTypes.map((cropType) => {
      return {
        name: cropType.key,
        message: string.sentenceCase(cropType.name.es)
      }
    })
  }

  private getCropTypesKey(cropTypes) {
    return cropTypes.map((cropType) => cropType.key)
  }

  private validateNormative(normative: string): string | boolean {
    if (!normative) {
      return 'Enter normative'
    }

    if (!Normative[normative]) {
      return 'The normative entered is not valid normative, please check which valid normatives exists: --normatives'
    }

    return true
  }

  private validateAlphaCode(alpha3Code: string): string | boolean {
    if (!alpha3Code) {
      return 'Enter alpha3Code'
    }

    if (!AlphaCode[alpha3Code]) {
      return 'The alpha 3 code entered is not valid, please check which valid alpha codes exists: --alphacodes'
    }

    return true
  }

  private validateDate(dateReference: string): string | boolean {
    if (!dateReference) {
      return 'Enter dateReference'
    }

    if (!moment(dateReference, 'YYYY-MM-DD', true).isValid()) {
      return 'The date has invalid format, should be YYYY-MM-DD'
    }

    return true
  }
}
