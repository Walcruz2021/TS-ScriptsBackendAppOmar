import { BaseCommand, flags } from '@adonisjs/core/build/standalone'
import StorageRepository from 'App/Core/Storage'
import Aws from '@ioc:Aws'
import Env from '@ioc:Adonis/Core/Env'
import { createEventAuditUseCase } from 'App/Core/EventsAuditEntities/Infrastructure/useCase'
import {
  EOperationTypeDataBase,
  IEntity
} from 'App/Core/EventsAuditEntities/Infrastructure/Mongoose/Interfaces/EventsAuditEntities.interface'
import ActiveIngredientRepository from 'App/Core/ActiveIngredient/Infrastructure/Mongoose/Repositories'
import SupplyRepository from 'App/Core/Supply/Infrastructure/Mongoose/Repositories'

export default class AddActiveIngredientSupply extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'add:activeIngredient:supply'

  /**
   * Command description is displayed in the "help" output
   */
  public static description = 'This command add active ingredient in supply'

  private nameFileBackup: string = 'add-active-ingredient-supply.json'

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

  public async run() {
    this.logger.success('Started add active ingredient in supply')
    try {
      if (this.rollbackCommand) {
        this.logger.success('Started rollback add active ingredient in supply')
        await this.rollback()
      } else {
        await this.execute()
      }
    } catch (error) {
      this.logger.error(`Error Message: ${error.message}`)
      this.logger.error(`Error: ${error}`)
    }
    this.logger.logUpdatePersist()
    this.logger.success('Add active ingredient in supply Success')
  }

  public async execute(): Promise<void> {
    let i: number = 0
    let listBackup: Array<Object> = []

    const key = await this.prompt.ask('Enter the key', {
      validate: this.validate
    })

    let data = await this.getFile(Env.get('AWS_PUBLIC_BUCKET_NAME'), key)
    let addActiveIngredientSupply = JSON.parse(data.body.toString('utf-8'))

    for (const item of addActiveIngredientSupply) {
      let findSupply = await SupplyRepository.findOne({
        _id: item.idSupply
      })

      if (!findSupply) {
        this.logger.log(`supply with id ${item.idSupply} not found`)
        continue
      }

      const supplyBackup = {
        supplyId: findSupply._id,
        data: findSupply
      }
      listBackup.push(supplyBackup)

      const listIngredientsSimple = await this.createListActiveIngredients(
        item,
        findSupply
      )
      await SupplyRepository.findOneAndUpdate(
        {
          _id: findSupply._id
        },
        { $push: { activeIngredients: listIngredientsSimple } }
      )

      await createEventAuditUseCase.execute(
        findSupply._id,
        IEntity.SUPPLY,
        EOperationTypeDataBase.UPDATE
      )

      i = this.processingProgressBar(i, addActiveIngredientSupply.length)
    }

    await StorageRepository.create(listBackup, this.nameFileBackup)
  }

  private async createListActiveIngredients(item, supply) {
    const list: any[] = []
    for (let index = 1; index < 7; index++) {
      const ingredient = item[`idActiveIgredient_${index}`]
      let composition = item[`composition_${index}`]
      if (!ingredient || !composition) {
        continue
      }
      let activeIngredient = await ActiveIngredientRepository.findOne({
        _id: ingredient
      })
      if (!activeIngredient) {
        this.logger.log(`Active Ingredient with id ${ingredient} not found`)
        continue
      }

      if (activeIngredient) {
        let calculateEiqNew =
          supply.unit === 'Lts'
            ? Number(activeIngredient.eiq) * (composition / 100) * 0.855253
            : Number(activeIngredient.eiq) * (composition / 100) * 0.892179

        list.push({
          activeIngredient: activeIngredient._id,
          eiqActiveIngredient: activeIngredient.eiq,
          composition: Number(composition),
          eiq: calculateEiqNew
        })
      }
    }
    return list
  }

  /**
   * Rollback Command
   */
  public async rollback(): Promise<void> {
    let i: number = 0
    const data = await StorageRepository.get(this.nameFileBackup)

    for (const item of data) {
      await SupplyRepository.update({ _id: item.supplyId }, { $set: item.data })

      i = this.processingProgressBar(i, data.length)
    }

    await StorageRepository.delete(this.nameFileBackup)
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

  /**
   * @function validate
   * @description Validate if data is not empty
   * @param data
   * @return String || Boolean
   * */

  private async validate(data: string): Promise<string | boolean> {
    if (!data) {
      return 'Can not be empty'
    }
    return true
  }
}
