import { BaseCommand, flags } from '@adonisjs/core/build/standalone'
import StorageRepository from 'App/Core/Storage'
import ActiveIngredientRepository from 'App/Core/ActiveIngredient/Infrastructure/Mongoose/Repositories'
import SupplyRepository from 'App/Core/Supply/Infrastructure/Mongoose/Repositories'
import { ActiveIngredient } from 'App/Core/ActiveIngredient/Infrastructure/Mongoose/Interfaces'
import Aws from '@ioc:Aws'
import Env from '@ioc:Adonis/Core/Env'
export default class UpdateEiqActiveIngredient extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'update:eiq:activeIngredient'

  /**
   * Command description is displayed in the "help" output
   */
  public static description = 'This command update eiq in active ingredient'

  private nameFileBackup: string = 'update-eiq-activeIngredient.json'

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
    this.logger.success('Started Update eiq in active ingredient')
    try {
      if (this.rollbackCommand) {
        this.logger.success('Started rollback Update eiq in active ingredient')
        await this.rollback()
      } else {
        await this.execute()
      }
    } catch (error) {
      this.logger.error(`Error Message: ${error.message}`)
      this.logger.error(`Error: ${error}`)
    }
    this.logger.logUpdatePersist()
    this.logger.success('Update eiq in active ingredient Success')
  }

  public async execute(): Promise<void> {
    let i: number = 0
    let listBackup: Array<Object> = []
    const key = await this.prompt.ask('Enter the key', {
      validate: this.validate
    })
    let data = await this.getFile(Env.get('AWS_PUBLIC_BUCKET_NAME'), key)
    let updateActiveIngredient = JSON.parse(data.body.toString('utf-8'))

    for (const item of updateActiveIngredient) {
      if (item.idActiveIngredient) {
        let checkActiveIngredient = await ActiveIngredientRepository.findOne({
          _id: item.idActiveIngredient
        })

        if (checkActiveIngredient) {
          const activeIngredientBackup = {
            activeIngredientId: item.idActiveIngredient,
            eiqPrevious: checkActiveIngredient.eiq,
            type: 'update'
          }
          listBackup.push(activeIngredientBackup)
          await ActiveIngredientRepository.findOneAndUpdate(
            {
              _id: item.idActiveIngredient
            },
            { eiq: item.eiq, 'name.es': item.nameEs, 'name.en': item.nameEng }
          )

          let backup = await this.updateSuppliesEiq(item)
          listBackup = listBackup.concat(backup)
        }
      } else {
        let activeIngredientDTO: ActiveIngredient = {
          name: {
            es: item.nameEs
          },
          eiq: item.eiq
        }

        if (item.nameEng) activeIngredientDTO.name.en = item.nameEng

        if (item.namePt) activeIngredientDTO.name.pt = item.namePt

        let newActiveIngredient = await ActiveIngredientRepository.create(
          activeIngredientDTO
        )

        const activeIngredientBackup = {
          activeIngredientId: newActiveIngredient._id,
          type: 'create'
        }
        listBackup.push(activeIngredientBackup)
      }

      i = this.processingProgressBar(i, updateActiveIngredient.length)
    }

    await StorageRepository.create(listBackup, this.nameFileBackup)
  }

  private async updateSuppliesEiq(item) {
    let listBackup: Array<Object> = []

    let suppliesByActiveIngredient = await SupplyRepository.findAll({
      'activeIngredients.activeIngredient': item.idActiveIngredient
    })

    for (const supply of suppliesByActiveIngredient) {
      if (supply.activeIngredients)
        for (const activeIngredient of supply.activeIngredients) {
          if (
            activeIngredient.activeIngredient.toString() ===
              item.idActiveIngredient &&
            activeIngredient.composition
          ) {
            let calculateEiqNew =
              supply.unit === 'Lts'
                ? Number(item.eiq) *
                  (activeIngredient.composition / 100) *
                  0.855253
                : Number(item.eiq) *
                  (activeIngredient.composition / 100) *
                  0.892179
            const supplyActiveIngredientBackup = {
              idSupply: supply._id,
              idActiveIngredient: item.idActiveIngredient,
              eiqPrevious: activeIngredient.eiq,
              eiqActiveIngredientPrevious: activeIngredient.eiqActiveIngredient,
              type: 'supplyActiveIngredientEiq'
            }
            listBackup.push(supplyActiveIngredientBackup)
            await SupplyRepository.findOneAndUpdate(
              {
                _id: supply._id,
                'activeIngredients.activeIngredient': item.idActiveIngredient
              },
              {
                $set: {
                  ['activeIngredients.$.eiqActiveIngredient']: item.eiq,
                  ['activeIngredients.$.eiq']: calculateEiqNew
                }
              }
            )
          }
        }
    }

    return listBackup
  }

  /**
   * Rollback Command
   */
  public async rollback(): Promise<void> {
    let i: number = 0
    const data = await StorageRepository.get(this.nameFileBackup)

    for (const item of data) {
      if (item.type === 'update') {
        await ActiveIngredientRepository.findOneAndUpdate(
          {
            _id: item.activeIngredientId
          },
          { eiq: item.eiqPrevious }
        )
      }
      if (item.type === 'create') {
        await ActiveIngredientRepository.deleteOne({
          _id: item.activeIngredientId
        })
      }
      if (item.type === 'supplyActiveIngredientEiq') {
        await SupplyRepository.findOneAndUpdate(
          {
            _id: item.idSupply,
            'activeIngredients.activeIngredient': item.idActiveIngredient
          },
          {
            $set: {
              ['activeIngredients.$.eiqActiveIngredient']:
                item.eiqActiveIngredientPrevious,
              ['activeIngredients.$.eiq']: item.eiqPrevious
            }
          }
        )
      }

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
