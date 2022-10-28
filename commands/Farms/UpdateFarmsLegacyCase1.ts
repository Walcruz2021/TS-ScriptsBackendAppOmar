import { BaseCommand, flags } from '@adonisjs/core/build/standalone'

import StorageRepository from 'App/Core/Storage'
import CropRepository from 'App/Core/Crop/Infrastructure/Mongoose/Repositories'
import FarmRepository from 'App/Core/Farm/Infrastructure/Mongoose/Repositories'

export default class UpdateFarmsLegacyCase1 extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'farm:updateLegacyCase1'

  /**
   * Command description is displayed in the "help" output
   */
  public static description =
    'This command is used for update farms legacies on case 1'

  @flags.boolean({ alias: 'r', description: 'Rollback flag' })
  public rollbackCommand: boolean

  private nameFileBackup: string = 'update-farms-legacy-case-1.json'

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

  private getProgressBar(currentPercentage: number) {
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
   * @returns
   */
  private processingProgressBar(index: number): number {
    if (index < 100) {
      index++
      this.logger.logUpdate(
        `Processing: ${this.getProgressBar(index)} ${index}%`
      )
    }
    return index
  }

  /**
   * Execute Command
   */
  public async execute(): Promise<void> {
    let i = 0

    const crops: any = await CropRepository.findAll({})
    const farms: any = await FarmRepository.findAll({})

    await StorageRepository.create(
      {
        crops,
        farms
      },
      this.nameFileBackup
    )

    const farmsByIdentifier: any = crops.reduce((group, element) => {
      const { identifier, lots } = element

      if (!lots?.length) {
        return group
      }

      group[identifier] = group[identifier] ?? []

      for (const farmLegacy of lots) {
        group[identifier].push({
          cropId: String(element._id),
          tagId: String(farmLegacy._id),
          tag: farmLegacy.tag,
          lots: farmLegacy.data.map((lotId) => String(lotId))
        })
      }

      return group
    }, {})

    let result: any = []

    for (const identifier in farmsByIdentifier) {
      for (const farmByIdentifier of farmsByIdentifier[identifier]) {
        const resultGrouped = farmByIdentifier.lots.reduce((group, element) => {
          group[element] = {
            cropsIds: group[element]?.cropsIds
              ? [...group[element].cropsIds, farmByIdentifier.cropId]
              : [farmByIdentifier.cropId],
            farms: group[element]?.farms
              ? [
                  ...group[element].farms,
                  {
                    tagId: String(farmByIdentifier.tagId),
                    tag: farmByIdentifier.tag
                  }
                ]
              : [
                  {
                    tagId: String(farmByIdentifier.tagId),
                    tag: farmByIdentifier.tag
                  }
                ]
          }

          return group
        }, {})

        result = {
          ...result,
          [identifier]: {
            ...resultGrouped
          }
        }
      }
    }

    const farmsByLots: any = Object.values(result)
      .map((element: any) => {
        i = this.processingProgressBar(i)

        for (const index in element) {
          if (element[index].farms.length <= 1) {
            continue
          }

          return {
            lotId: index,
            ...result[index][0]
          }
        }
      })
      .filter((element) => element)

    console.log('ALWAYS EMPTY')
    console.log('farmsByLots')
    console.log(farmsByLots)
  }

  /**
   * Rollback Command
   */
  public async rollback(): Promise<void> {
    let i: number = 0

    const data = await StorageRepository.get(this.nameFileBackup)

    for (const crop of data.crops) {
      await CropRepository.findOneAndUpdate(
        {
          _id: crop._id
        },
        {
          $set: {
            ...crop
          }
        }
      )
    }

    for (const farm of data.farms) {
      await FarmRepository.findOneAndUpdate(
        {
          _id: farm._id
        },
        {
          $set: {
            ...farm
          }
        }
      )

      i = this.processingProgressBar(i)
    }

    await StorageRepository.delete(this.nameFileBackup)
  }

  public async run() {
    try {
      this.logger.info('Start Process Update Farms Legacy Data Case 1')
      if (this.rollbackCommand) {
        await this.rollback()
      } else {
        await this.execute()
      }
    } catch (error) {
      this.logger.error(`Error Message: ${error.message}`)
      this.logger.error(`Error: ${error}`)
    }

    this.logger.logUpdatePersist()
    this.logger.success('Farms Legacy data updated')
  }
}
