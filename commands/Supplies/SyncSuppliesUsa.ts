import { BaseCommand, flags } from '@adonisjs/core/build/standalone'
import axios from 'axios'
import Env from '@ioc:Adonis/Core/Env'
import { HmacMD5, enc } from 'crypto-js'
import { format } from 'util'
import CountryRepository from 'App/Core/Country/Infraestructure/Mongoose/Repositories'
import { Supply } from 'App/Core/Supply/Infrastructure/Mongoose/Interfaces'
import { StateUsaSuppliesCdm } from 'App/Core/Supply/Infrastructure/Mongoose/Interfaces/Supply.interface'
import { ProductTypeUsaCdm } from '../../dataset/productType-Usa-Cdm'
import ActiveIngredientRepository from 'App/Core/ActiveIngredient/Infrastructure/Mongoose/Repositories'
import SupplyRepository from 'App/Core/Supply/Infrastructure/Mongoose/Repositories'
import { ActiveIngredientUsaCdm } from '../../dataset/activeIngredient-Usa-Cdm'
import { createEventAuditUseCase } from 'App/Core/EventsAuditEntities/Infrastructure/useCase'
import StorageService from 'App/Core/Storage/Services/StorageService'
import {
  EOperationTypeDataBase,
  IEntity
} from 'App/Core/EventsAuditEntities/Infrastructure/Mongoose/Interfaces/EventsAuditEntities.interface'
import SupplyTypeRepository from 'App/Core/SupplyType/Infrastructure/Mongoose/Repositories'
import { NotProductTypeCdm } from '../../dataset/notProductTypeCdm'
import { StateUnknownCdm } from '../../dataset/stateUnknownCdm'
import { NotAssignedActiveIngredientCdm } from '../../dataset/notAssignedActiveIngredientCdm'
import UnitTypeSupply from 'App/Core/UnitTypeSupply/Infrastructure/Mongoose/Models/UnitTypeSupply'
export default class SyncSuppliesUsa extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'sync:supplies:usa'

  /**
   * Command description is displayed in the "help" output
   */
  public static description = 'This command add supplies usa by sync with CDM'

  @flags.boolean({ alias: 'r', description: 'Rollback flag' })
  public rollbackCommand: boolean

  private nameFileBackup: string = 'add-supplies-usa-CDM.json'

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
        )} ${Math.trunc((index * 100) / limit)}%  count ${index}/${limit}`
      )
    }
    return index
  }

  public async run() {
    this.logger.success('Started add supplies usa by sync')
    try {
      if (this.rollbackCommand) {
        this.logger.success('Started rollback add supplies usa by sync')
        await this.rollback()
      } else {
        await this.execute()
      }
    } catch (error) {
      this.logger.error(`Error Message: ${error.message}`)
      this.logger.error(`Error: ${error}`)
    }
    this.logger.logUpdatePersist()
    this.logger.success('Add supplies usa by sync Success')
  }

  public async execute(): Promise<void> {
    let i: number = 0
    let alreadyExists: any = []
    let countCreated = 0
    let listSuppliesCdm = await this.getByUrlCdm(Env.get('SUPPLIES_LIST'))
    let countryUsa = await CountryRepository.findOne({ alpha3Code: 'USA' })

    const fileExists = await StorageService.fileExists(this.nameFileBackup)
    if (!fileExists) {
      await StorageService.create([], this.nameFileBackup)
    }

    for (const supply of listSuppliesCdm) {
      let checkExists = await SupplyRepository.findOne({
        code: supply.PId,
        alphaCode: 'USA'
      })
      if (checkExists) {
        // this.logger.log(`supply with code ${supply.PId} already exists`)
        alreadyExists.push(supply.PId)
        i = this.processingProgressBar(i, listSuppliesCdm.length)
        continue
      }

      if (skipCdm.includes(supply.Name)) {
        continue
      }
      let listSuppliesCdmDetail = await this.getByUrlCdm(
        format(Env.get('SUPPLIES_LIST_DETAIL'), supply.PId)
      )

      if (!listSuppliesCdmDetail) {
        this.logger.error(`Not found detail from supply pid supply.PId`)
        continue
      }

      const supplyCreated = await this.createSupply(
        listSuppliesCdmDetail,
        countryUsa._id
      )

      if (!supplyCreated) {
        i++
        continue
      }

      // const supplyBackup = {
      //   supplyId: supplyCreated._id
      // }
      // listBackup.push(supplyBackup)
      await StorageService.add(
        {
          supplyId: supplyCreated._id
        },
        this.nameFileBackup
      )
      countCreated++
      i = this.processingProgressBar(i, listSuppliesCdm.length)
    }
    await this.results({
      countCreated,
      countExists: alreadyExists.length,
      alreadyExists
    })
  }

  private async createSupply(supplyCdmDto: any, countryId: string) {
    let code = supplyCdmDto.ProductTypes[0]
      ? ProductTypeUsaCdm[supplyCdmDto.ProductTypes[0]]
      : NotProductTypeCdm[supplyCdmDto.Name]
    let supplyType = await SupplyTypeRepository.findOne({
      code: code
    })

    let unit =
      supplyCdmDto.Formulation.State === 'Unknown'
        ? StateUnknownCdm[supplyCdmDto.Name]
        : StateUsaSuppliesCdm[supplyCdmDto.Formulation.State]

    if (!supplyType || !unit) {
      this.logger.error(
        `Not unit ${supplyCdmDto.Formulation.State} in dictionary or supplyType ${supplyCdmDto.ProductTypes[0]}`
      )
      return false
    }

    let supplyDto: Supply = {
      name: supplyCdmDto.Name,
      company: supplyCdmDto.Manufacturer,
      code: supplyCdmDto.PId,
      unit: StateUsaSuppliesCdm[supplyCdmDto.Formulation.State],
      brand: supplyCdmDto.ProductKey,
      supplyType: supplyType.code,
      typeId: supplyType._id,
      compositon: supplyCdmDto.Formulation.Percent,
      alphaCode: 'USA',
      countryId: countryId,
      activeIngredients: [],
      classToxic: ''
    }
    let findUnitTypeSupply
    switch (supplyDto.unit) {
      case 'Kgs':
        findUnitTypeSupply = await UnitTypeSupply.findOne({
          key: 'lb'
        })
        supplyDto.unitTypeSupply = findUnitTypeSupply?._id
        break
      case 'Lts':
        findUnitTypeSupply = await UnitTypeSupply.findOne({
          key: 'fl-oz'
        })
        supplyDto.unitTypeSupply = findUnitTypeSupply?._id
        break
      default:
    }

    for (const active of supplyCdmDto.Formulation.Actives) {
      let activeName =
        active.Name === 'Not Assigned'
          ? NotAssignedActiveIngredientCdm[supplyCdmDto.Name]
          : ActiveIngredientUsaCdm.find(
              (activeCdm) => activeCdm.name === active.Name
            )
      if (!activeName) {
        this.logger.error(`Not exist active ingredient in json ${active.Name}`)
        return false
      }

      let findActiveIngredient = await ActiveIngredientRepository.findOne({
        'name.en': activeName?.nameEn
      })

      if (!findActiveIngredient) {
        this.logger.error(`Not exist active ingredient ${activeName?.nameEn}`)
        return false
      }

      let eiqCalculate = this.calculateEiq(
        supplyDto.unit!,
        findActiveIngredient.eiq,
        active.Percent
      )

      let activeIngredient = {
        activeIngredient: findActiveIngredient._id,
        eiqActiveIngredient: findActiveIngredient.eiq,
        eiq: eiqCalculate,
        composition: active.Percent
      }
      supplyDto.activeIngredients?.push(activeIngredient)
    }

    const supply = await SupplyRepository.create(supplyDto)
    await createEventAuditUseCase.execute(
      supply._id,
      IEntity.SUPPLY,
      EOperationTypeDataBase.CREATE
    )
    return supply
  }

  private async getByUrlCdm(url: string) {
    let auth = this.getAuthTokenCDM(url)

    const suppliesList = await axios
      .get(url, {
        headers: {
          Authorization: auth
        }
      })
      .catch((err) => err)

    return suppliesList.data
  }

  private calculateEiq(unit: string, eiq: number, composition: number) {
    let calculateEiq =
      unit === 'Lts'
        ? eiq * (composition / 100) * 0.855253
        : eiq * (composition / 100) * 0.892179

    return calculateEiq
  }

  private getAuthTokenCDM(url: string) {
    let date = new Date()

    const pad2 = (str) => String(str).padStart(2, '0')
    const DD = pad2(date.getUTCDate())
    const MM = pad2(date.getUTCMonth() + 1)
    const YYYY = date.getUTCFullYear()
    const hh = pad2(date.getUTCHours())
    const mm = pad2(date.getUTCMinutes())
    const ss = pad2(date.getUTCSeconds())
    let formatTimestampForHash = `${DD}${MM}${YYYY}${hh}${mm}${ss}`

    let stripProtocolFromUrl = url.replace(/https|http/i, '').replace('://', '')

    const timeStamp = formatTimestampForHash
    const formattedUrl = `${stripProtocolFromUrl}${timeStamp}`
    const hash = HmacMD5(formattedUrl, Env.get('PASSWORD_CDM')).toString(
      enc.Base64
    )

    let auth = `${Env.get('USERNAME_CDM')}:${hash}:${timeStamp}`

    return auth
  }

  /**
   * Rollback Command
   */
  public async rollback(): Promise<void> {
    let i: number = 0
    const data = await StorageService.get(this.nameFileBackup)

    if (data) {
      for (const item of data) {
        await SupplyRepository.deleteOne({ _id: item.supplyId })

        i = this.processingProgressBar(i, data.length)
      }

      //await StorageService.delete(nameFileBackup)
    } else {
      this.logger.error('File not exists')
    }
  }

  private async results(result): Promise<void> {
    try {
      this.logger.info(`currentTime: ${new Date()}`)
      this.logger.info(`countCreated: ${result.countCreated}`)
      this.logger.info(`countAlreadyExists: ${result.countExists}`)
      // this.logger.info(`alreadyExists: ${result.alreadyExists}`)
    } catch (err) {
      this.logger.error(err.message)
    }
  }
}

export const skipCdm = ['Halo™ Electronic Termite Detection']
