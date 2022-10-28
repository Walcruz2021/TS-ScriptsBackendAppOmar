import { BaseCommand, flags } from '@adonisjs/core/build/standalone'
import StorageRepository from 'App/Core/Storage'
import ActiveIngredientRepository from 'App/Core/ActiveIngredient/Infrastructure/Mongoose/Repositories'
import Aws from '@ioc:Aws'
export default class AddPtActiveIngredients extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'add:pt:active:ingredients'

  /**
   * Command description is displayed in the "help" output
   */
  public static description = 'This command add pt in active ingredient'

  private nameFileBackup: string = 'update-pt-activeIngredient.json'

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
    this.logger.success('Started add pt in active ingredient')
    try {
      if (this.rollbackCommand) {
        this.logger.success('Started rollback add pt in active ingredient')
        await this.rollback()
      } else {
        await this.execute()
      }
    } catch (error) {
      this.logger.error(`Error Message: ${error.message}`)
      this.logger.error(`Error: ${error}`)
    }
    this.logger.logUpdatePersist()
    this.logger.success('add pt in active ingredient Success')
  }

  public async execute(): Promise<void> {
    let i: number = 0
    let listBackup: Array<Object> = []
    const bucket = await this.prompt.ask('Enter the bucket', {
      validate: this.validate
    })
    const key = await this.prompt.ask('Enter the key', {
      validate: this.validate
    })

    let data = await this.getFile(bucket, key)
    let addPtActiveIngredient = JSON.parse(data.body.toString('utf-8'))

    for (const item of addPtActiveIngredient) {
      let activeIngredient = await ActiveIngredientRepository.findOne({
        'name.es': { $regex: `^${item.nameEs}$`, $options: 'i' }
      })

      if (activeIngredient) {
        const activeIngredientBackup = {
          activeIngredientId: activeIngredient._id,
          ptPrevious: activeIngredient.name.pt
        }

        listBackup.push(activeIngredientBackup)
        await ActiveIngredientRepository.findOneAndUpdate(
          {
            _id: activeIngredient._id
          },
          { 'name.pt': item.namePt }
        )
      }

      i = this.processingProgressBar(i, addPtActiveIngredient.length)
    }

    await StorageRepository.create(listBackup, this.nameFileBackup)
  }

  /**
   * Rollback Command
   */
  public async rollback(): Promise<void> {
    let i: number = 0
    const data = await StorageRepository.get(this.nameFileBackup)

    for (const item of data) {
      if (item.ptPrevious) {
        await ActiveIngredientRepository.findOneAndUpdate(
          {
            _id: item.activeIngredientId
          },
          { $unset: { 'name.pt': '' } }
        )
      } else {
        await ActiveIngredientRepository.findOneAndUpdate(
          {
            _id: item.activeIngredientId
          },
          { $unset: { 'name.pt': '' } }
        )
      }

      i = this.processingProgressBar(i, data.length)
    }

    await StorageRepository.delete(this.nameFileBackup)
  }

  private async getFile(bucket: string, key: string): Promise<any> {
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
