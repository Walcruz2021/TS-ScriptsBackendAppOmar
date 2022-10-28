import { BaseCommand, flags } from '@adonisjs/core/build/standalone'
import Aws from '@ioc:Aws'
import { Supply } from 'App/Core/Supply/Infrastructure/Mongoose/Interfaces'
import ActiveIngredientRepository from 'App/Core/ActiveIngredient/Infrastructure/Mongoose/Repositories'
import CountryRepository from 'App/Core/Country/Infraestructure/Mongoose/Repositories'
import SupplyRepository from 'App/Core/Supply/Infrastructure/Mongoose/Repositories'
import SupplyTypeRepository from 'App/Core/SupplyType/Infrastructure/Mongoose/Repositories'
import StorageRepository from 'App/Core/Storage'
import Env from '@ioc:Adonis/Core/Env'
import { createEventAuditUseCase } from 'App/Core/EventsAuditEntities/Infrastructure/useCase'
import {
  EOperationTypeDataBase,
  IEntity
} from 'App/Core/EventsAuditEntities/Infrastructure/Mongoose/Interfaces/EventsAuditEntities.interface'
import axios from 'axios'
export default class AddSupplies extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'add:supplies'

  /**
   * Command description is displayed in the "help" output
   */
  public static description = 'This command adds supplies in Supply collection'

  @flags.boolean({ alias: 'rSeed', description: 'Rollback Seed flag' })
  public rollbackCommandSeed: boolean
  @flags.boolean({
    alias: 'rPhytosanitary',
    description: 'Rollback Phytosanitary flag'
  })
  public rollbackCommandPhytosanitary: boolean
  @flags.boolean({
    alias: 'rFertilizer',
    description: 'Rollback Fertilizer flag'
  })
  public rollbackCommandFertilizer: boolean

  @flags.boolean({ alias: 'addSeed', description: 'Add Seed flag' })
  public addSeed: boolean

  @flags.boolean({
    alias: 'addPhytosanitary',
    description: 'Add Phytosanitary flag'
  })
  public addPhytosanitary: boolean

  @flags.boolean({ alias: 'addFertilizer', description: 'Add Fertilizer flag' })
  public addFertilizer: boolean

  private nameFileBackupSeed: string = 'suppliesSeed.json'
  private nameFileBackupPhytosanitary: string = 'suppliesPhytosanitary.json'
  private nameFileBackupFertilizer: string = 'suppliesFertilizer.json'

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

  private async createListActiveIngredients(item) {
    const listActiveIngredients = await ActiveIngredientRepository.findAll({})
    const list: any[] = []
    for (let index = 0; index < 5; index++) {
      const ingredient = item[`activeIngredients_${index}`].trim()
      const composition = item[`composition_${index}`].trim()
      if (ingredient !== '' && composition !== '') {
        const activeIngredient = listActiveIngredients.find(
          (activeIngredient) =>
            ingredient.toUpperCase() ===
              activeIngredient.name.es?.toUpperCase() ||
            ingredient.toUpperCase() ===
              activeIngredient.name.en?.toUpperCase() ||
            ingredient.toUpperCase() === activeIngredient.name.pt?.toUpperCase()
        )
        if (activeIngredient) {
          list.push({
            activeIngredient: activeIngredient._id,
            eiqActiveIngredient: activeIngredient.eiq,
            composition: Number(composition.replace(/,/g, '.')),
            eiq:
              (activeIngredient.eiq * Number(composition.replace(/,/g, '.'))) /
              100
          })
        }
      }
    }
    return list
  }

  public async run() {
    this.logger.success('Started add supplies')
    try {
      if (this.rollbackCommandSeed) {
        this.logger.success('Started rollback add supplies seeds')
        await this.rollbackSeed()
      } else if (this.rollbackCommandFertilizer) {
        this.logger.success('Started rollback add supplies Fertilizer')
        await this.rollbackFertilizer()
      } else if (this.rollbackCommandPhytosanitary) {
        this.logger.success('Started rollback add supplies Phytosanitary')
        await this.rollbackPhytosanitary()
      } else if (this.addSeed) {
        this.logger.success('Started add supplies seed')
        await this.executeSeed()
      } else if (this.addPhytosanitary) {
        this.logger.success('Started add supplies phytosanitary')
        await this.executePhytosanitary()
      } else if (this.addFertilizer) {
        this.logger.success('Started add supplies fertilizer')
        await this.executeFertilizer()
      } else {
        this.logger.error(`not found flag`)
      }
    } catch (error) {
      this.logger.error(`Error Message: ${error.message}`)
      this.logger.error(`Error: ${error}`)
    }
    this.logger.logUpdatePersist()
    this.logger.success('Add Supplies Success')
  }

  public async executeSeed(): Promise<void> {
    let i: number = 0
    let listSupplyBackup: Array<Object> = []
    let supplyDto: Supply
    let country
    let supplyType

    const countries = await CountryRepository.findAll({ disabled: false })
    const supplyTypes = await SupplyTypeRepository.findAll({})

    let suppliesSeeds = await this.getPromptS3()

    for (const supply of suppliesSeeds) {
      let checkIfExistSupply = await SupplyRepository.findOne({
        code: supply.code,
        alphaCode: supply.alphaCode,
        supplyType: supply.supplyType
      })

      if (!checkIfExistSupply) {
        country = countries.find(
          (element) => element.alpha3Code === supply.alphaCode
        )
        supplyType = supplyTypes.find(
          (element) => element.code === supply.supplyType
        )

        if (country && supplyType) {
          supplyDto = {
            unit: supply.unit,
            code: supply.code,
            typeId: supplyType._id,
            name: supply.name,
            company: supply.company,
            alphaCode: supply.alphaCode,
            countryId: country._id,
            supplyType: supply.supplyType,
            unitTypeSupply: supply.unitTypeKey,
            brand: supply.brand
          }

          const supplyDocument = await SupplyRepository.create(supplyDto)
          const SupplyBackup = {
            _id: String(supplyDocument._id)
          }

          listSupplyBackup.push(SupplyBackup)
          await createEventAuditUseCase.execute(
            supplyDocument._id,
            IEntity.SUPPLY,
            EOperationTypeDataBase.CREATE
          )
        }
      }
      i = this.processingProgressBar(i, suppliesSeeds.length)
    }
    await StorageRepository.create(listSupplyBackup, this.nameFileBackupSeed)
  }
  public async executeFertilizer(): Promise<void> {
    let i: number = 0
    let listSupplyBackup: Array<Object> = []
    let supplyDto: Supply
    let country
    let supplyType

    const countries = await CountryRepository.findAll({ disabled: false })
    const supplyTypes = await SupplyTypeRepository.findAll({})

    let suppliesFertilizer = await this.getPromptS3()

    for (const supply of suppliesFertilizer) {
      let checkIfExistSupply = await SupplyRepository.findOne({
        code: supply.code,
        alphaCode: supply.alphaCode,
        supplyType: supply.supplyType
      })

      if (!checkIfExistSupply) {
        country = countries.find(
          (element) => element.alpha3Code === supply.alphaCode
        )
        supplyType = supplyTypes.find(
          (element) => element.code === supply.supplyType
        )

        if (country && supplyType) {
          supplyDto = {
            ...supply,
            typeId: supplyType._id,
            countryId: country._id,
            unitTypeSupply: supply.unitTypeKey
          }

          const supplyDocument = await SupplyRepository.create(supplyDto)
          const SupplyBackup = {
            _id: String(supplyDocument._id)
          }

          listSupplyBackup.push(SupplyBackup)
          await createEventAuditUseCase.execute(
            supplyDocument._id,
            IEntity.SUPPLY,
            EOperationTypeDataBase.CREATE
          )
        }
      }
      i = this.processingProgressBar(i, suppliesFertilizer.length)
    }
    await StorageRepository.create(
      listSupplyBackup,
      this.nameFileBackupFertilizer
    )
  }
  public async executePhytosanitary(): Promise<void> {
    let i: number = 0
    let listSupplyBackup: Array<Object> = []
    let supplyDto: Supply
    let country
    let supplyType

    const countries = await CountryRepository.findAll({ disabled: false })
    const supplyTypes = await SupplyTypeRepository.findAll({})

    let suppliesData = await this.getPromptS3()

    for (const supply of suppliesData) {
      let checkIfExistSupply = await SupplyRepository.findOne({
        code: supply.code,
        alphaCode: supply.alphaCode,
        supplyType: supply.supplyType
      })

      if (!checkIfExistSupply) {
        country = countries.find(
          (element) => element.alpha3Code === supply.alphaCode
        )
        supplyType = supplyTypes.find(
          (element) => element.code === supply.supplyType
        )

        if (country && supplyType) {
          supplyDto = {
            unit: supply.unit,
            code: supply.code.toString(),
            typeId: supplyType._id,
            name: supply.name,
            company: supply.company,
            alphaCode: supply.alphaCode,
            countryId: country._id,
            supplyType: supply.supplyType,
            brand: supply.brand,
            unitTypeSupply: supply.unitTypeKey
          }

          if (
            supply.composition_0.trim() !== '' &&
            supply.composition_1.trim() === '' &&
            supply.composition_2.trim() === '' &&
            supply.composition_3.trim() === '' &&
            supply.composition_4.trim() === ''
          ) {
            const listIngredientsSimple =
              await this.createListActiveIngredients(supply)

            supplyDto.compositon = supply.composition_0
            supplyDto.activeIngredients = listIngredientsSimple

            const supplyDocument = await SupplyRepository.create(supplyDto)
            const SupplyBackup = {
              _id: String(supplyDocument._id)
            }
            listSupplyBackup.push(SupplyBackup)
            await createEventAuditUseCase.execute(
              supplyDocument._id,
              IEntity.SUPPLY,
              EOperationTypeDataBase.CREATE
            )
          } else {
            let composition = ''
            if (supply.composition_1.trim() !== '') {
              composition = supply.composition_0.concat(
                '+',
                supply.composition_1
              )
            }
            if (supply.composition_2.trim() !== '') {
              composition = composition.concat('+', supply.composition_2)
            }
            if (supply.composition_3.trim() !== '') {
              composition = composition.concat('+', supply.composition_3)
            }
            if (supply.composition_4.trim() !== '') {
              composition = composition.concat('+', supply.composition_4)
            }

            const listActiveIngredients =
              await this.createListActiveIngredients(supply)

            supplyDto.compositon = composition
            supplyDto.activeIngredients = listActiveIngredients

            const supplyDocument = await SupplyRepository.create(supplyDto)
            const SupplyBackup = {
              _id: String(supplyDocument._id)
            }
            listSupplyBackup.push(SupplyBackup)
            await createEventAuditUseCase.execute(
              supplyDocument._id,
              IEntity.SUPPLY,
              EOperationTypeDataBase.CREATE
            )
          }
        }
      }
      i = this.processingProgressBar(i, suppliesData.length)
    }
    await StorageRepository.create(
      listSupplyBackup,
      this.nameFileBackupPhytosanitary
    )
  }
  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  async getFile(bucket: string, key: string): Promise<any> {
    this.logger.await('Waiting for the data in S3')
    const s3 = new Aws.S3()
    let data = await s3
      .getObject({
        Bucket: bucket,
        Key: key
      })
      .promise()
    return {
      body: data.Body,
      ContentType: data.ContentType
    }
  }
  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  async getPromptS3() {
    const bucket = Env.get('AWS_PUBLIC_BUCKET_NAME')
    const hasUrl = await this.prompt.toggle('It has an s3 url?', ['Yes', 'Not'])
    if (hasUrl) {
      const url = await this.prompt.ask('Enter the url', {
        validate: this.validate
      })
      return await this.getFileByUrl(url)
    } else {
      const key = await this.prompt.ask('Enter the key', {
        validate: this.validate
      })
      let data = await this.getFile(bucket, key)
      return JSON.parse(data.body.toString('utf-8'))
    }
  }
  async getFileByUrl(url): Promise<any> {
    this.logger.await('Waiting for the data in S3')
    const response = await axios.get(url, { responseType: 'json' })
    return response.data
  }
  /**
   * Rollback Command
   */
  public async rollbackSeed(): Promise<void> {
    let i: number = 0
    const data = await StorageRepository.get(this.nameFileBackupSeed)

    for (const item of data) {
      await SupplyRepository.deleteOne({ _id: item._id })
      i = this.processingProgressBar(i, data.length)
    }

    await StorageRepository.delete(this.nameFileBackupSeed)
  }
  /**
   * Rollback Command
   */
  public async rollbackFertilizer(): Promise<void> {
    let i: number = 0
    const data = await StorageRepository.get(this.nameFileBackupFertilizer)

    for (const item of data) {
      await SupplyRepository.deleteOne({ _id: item._id })
      i = this.processingProgressBar(i, data.length)
    }

    await StorageRepository.delete(this.nameFileBackupFertilizer)
  }
  /**
   * Rollback Command
   */
  public async rollbackPhytosanitary(): Promise<void> {
    let i: number = 0
    const data = await StorageRepository.get(this.nameFileBackupPhytosanitary)

    for (const item of data) {
      await SupplyRepository.deleteOne({ _id: item._id })
      i = this.processingProgressBar(i, data.length)
    }

    await StorageRepository.delete(this.nameFileBackupPhytosanitary)
  }

  private async validate(data: string): Promise<string | boolean> {
    if (!data) {
      return 'Can not be empty'
    }
    return true
  }
}
