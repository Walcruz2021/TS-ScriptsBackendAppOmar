import { BaseCommand, flags } from '@adonisjs/core/build/standalone'
import AchievementRepository from 'App/Core/Achievement/Infrastructure/Mongoose/Repositories'
import StorageRepository from 'App/Core/Storage'
import Aws from '@ioc:Aws'

export default class UpdateUnitAchievementSupplies extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'update:unit:achievement:supplies'

  /**
   * Command description is displayed in the "help" output
   */
  public static description = 'This command update unit in achievement supplies'

  private nameFileBackup: string = 'update-unit-achievement-supplies.json'

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
    this.logger.success('Started Update unit in achievement supplies')
    try {
      if (this.rollbackCommand) {
        this.logger.success(
          'Started rollback Update unit in achievement supplies'
        )
        await this.rollback()
      } else {
        await this.execute()
      }
    } catch (error) {
      this.logger.error(`Error Message: ${error.message}`)
      this.logger.error(`Error: ${error}`)
    }
    this.logger.logUpdatePersist()
    this.logger.success('Update unit in achievement supplies Success')
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
    let unitAchievementSupplies = JSON.parse(data.body.toString('utf-8'))

    for (const item of unitAchievementSupplies) {
      let achievement = await AchievementRepository.findOne({
        _id: item.id_achievement
      })
      if (achievement) {
        for (const supply of achievement.supplies) {
          if (
            supply.unit === 'cm3' &&
            supply._id.toString() === item.id_achievement_supply
          ) {
            const achievementBackup = {
              achievementId: item.id_achievement,
              supplyId: item.id_achievement_supply,
              type: 'cm3',
              totalPrevious: supply.total,
              quantityPrevious: supply.quantity
            }

            listBackup.push(achievementBackup)

            let quantity = supply.quantity! / 1000
            let total = supply.total! / 1000

            await AchievementRepository.findOneAndUpdate(
              {
                _id: item.id_achievement,
                'supplies._id': item.id_achievement_supply
              },
              {
                $set: {
                  ['supplies.$.quantity']: quantity,
                  ['supplies.$.total']: total,
                  ['supplies.$.unit']: 'Lts'
                }
              }
            )
            i = this.processingProgressBar(i, unitAchievementSupplies.length)
          }

          if (
            supply.unit === 'ml' &&
            supply._id.toString() === item.id_achievement_supply
          ) {
            const achievementBackup = {
              achievementId: item.id_achievement,
              supplyId: item.id_achievement_supply,
              type: 'ml',
              totalPrevious: supply.total,
              quantityPrevious: supply.quantity
            }

            listBackup.push(achievementBackup)

            let quantity = supply.quantity! / 1000
            let total = supply.total! / 1000

            await AchievementRepository.findOneAndUpdate(
              {
                _id: item.id_achievement,
                'supplies._id': item.id_achievement_supply
              },
              {
                $set: {
                  ['supplies.$.quantity']: quantity,
                  ['supplies.$.total']: total,
                  ['supplies.$.unit']: 'Lts'
                }
              }
            )
          }

          if (
            supply.unit === 'gr' &&
            supply._id.toString() === item.id_achievement_supply
          ) {
            const achievementBackup = {
              achievementId: item.id_achievement,
              supplyId: item.id_achievement_supply,
              type: 'gr',
              totalPrevious: supply.total,
              quantityPrevious: supply.quantity
            }

            listBackup.push(achievementBackup)

            let quantity = supply.quantity! / 1000
            let total = supply.total! / 1000

            await AchievementRepository.findOneAndUpdate(
              {
                _id: item.id_achievement,
                'supplies._id': item.id_achievement_supply
              },
              {
                $set: {
                  ['supplies.$.quantity']: quantity,
                  ['supplies.$.total']: total,
                  ['supplies.$.unit']: 'Kgs'
                }
              }
            )
          }

          if (
            supply.unit === 'kg' &&
            supply._id.toString() === item.id_achievement_supply
          ) {
            const achievementBackup = {
              achievementId: item.id_achievement,
              supplyId: item.id_achievement_supply,
              type: 'kg'
            }

            listBackup.push(achievementBackup)

            await AchievementRepository.findOneAndUpdate(
              {
                _id: item.id_achievement,
                'supplies._id': item.id_achievement_supply
              },
              { $set: { ['supplies.$.unit']: 'Kgs' } }
            )
          }
          i = this.processingProgressBar(i, unitAchievementSupplies.length)
        }
      }
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
      if (item.type === 'cm3') {
        await AchievementRepository.findOneAndUpdate(
          {
            _id: item.achievementId,
            'supplies._id': item.supplyId
          },
          {
            $set: {
              ['supplies.$.quantity']: item.quantityPrevious,
              ['supplies.$.total']: item.totalPrevious,
              ['supplies.$.unit']: 'cm3'
            }
          }
        )
      }

      if (item.type === 'ml') {
        await AchievementRepository.findOneAndUpdate(
          {
            _id: item.achievementId,
            'supplies._id': item.supplyId
          },
          {
            $set: {
              ['supplies.$.quantity']: item.quantityPrevious,
              ['supplies.$.total']: item.totalPrevious,
              ['supplies.$.unit']: 'ml'
            }
          }
        )
      }

      if (item.type === 'gr') {
        await AchievementRepository.findOneAndUpdate(
          {
            _id: item.achievementId,
            'supplies._id': item.supplyId
          },
          {
            $set: {
              ['supplies.$.quantity']: item.quantityPrevious,
              ['supplies.$.total']: item.totalPrevious,
              ['supplies.$.unit']: 'gr'
            }
          }
        )
      }

      if (item.type === 'kg') {
        await AchievementRepository.findOneAndUpdate(
          {
            _id: item.achievementId,
            'supplies._id': item.supplyId
          },
          {
            $set: {
              ['supplies.$.unit']: 'kg'
            }
          }
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
