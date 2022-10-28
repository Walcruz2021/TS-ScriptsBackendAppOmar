import { BaseCommand, flags } from '@adonisjs/core/build/standalone'

import StorageRepository from 'App/Core/Storage'
import CropRepository from 'App/Core/Crop/Infrastructure/Mongoose/Repositories'
import FarmRepository from 'App/Core/Farm/Infrastructure/Mongoose/Repositories'
import LotRepository from 'App/Core/Lot/Infrastructure/Mongoose/Repositories'
import CompanyRepository from 'App/Core/Company/Infrastructure/Mongoose/Repositories'
import { sendLegacyFarmData, legacyCasesMockData } from 'App/Core/utils/Farms'
import { removeAccents } from 'App/utils'

export default class UpdateFarmsLegacyAllCases extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'farm:updateLegacyAllCases'

  /**
   * Command description is displayed in the "help" output
   */
  public static description =
    'This command is used for update farms legacies on all cases'

  @flags.boolean({ alias: 'r', description: 'Rollback flag' })
  public rollbackCommand: boolean

  private nameFileBackup: string = 'update-farms-legacy-all-cases.json'

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

    const crops: any = await CropRepository.findAll({
      cancelled: {
        $ne: true
      }
    })
    const farms: any = await FarmRepository.findAll({})
    const lots: any = await LotRepository.findAll({})

    await StorageRepository.create(
      {
        crops,
        farms,
        lots
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
          crop: {
            _id: String(element._id),
            tagId: String(farmLegacy._id)
          },
          tag: farmLegacy.tag,
          lots: farmLegacy.data.map((lotId) => String(lotId))
        })
      }

      return group
    }, {})

    let result: any = {}

    for (const identifier in farmsByIdentifier) {
      const resultGrouped = farmsByIdentifier[identifier].reduce(
        (group, element) => {
          const oldTag = element.tag

          let newTag = removeAccents(
            element.tag
              .toLowerCase()
              .trimStart()
              .trimEnd()
              .replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase())
          )

          const cases = group[newTag]?.cases ?? {
            case2: false,
            case3: false,
            case4: false
          }

          for (const farmLegacy of legacyCasesMockData.CASE_2) {
            if (
              String(farmLegacy.identifiers).split(', ').includes(identifier) &&
              String(farmLegacy.oldTags).split(', ').includes(oldTag) &&
              farmLegacy.newTag
            ) {
              cases.case2 = true

              newTag = farmLegacy.newTag

              break
            }
          }

          for (const farmLegacy of legacyCasesMockData.CASE_4) {
            if (
              String(farmLegacy.identifiers).split(', ').includes(identifier) &&
              String(farmLegacy.oldTags).split(', ').includes(oldTag) &&
              farmLegacy.newTag
            ) {
              cases.case4 = true

              newTag = farmLegacy.newTag

              break
            }
          }

          if (oldTag !== newTag) {
            cases.case3 = true
          }

          group[newTag] = {
            cases,
            identifier,
            crops: group[newTag]?.crops
              ? [...group[newTag].crops, element.crop]
              : [element.crop],
            tags: group[newTag]?.tags
              ? [...group[newTag].tags, oldTag]
              : [oldTag],
            lots: group[newTag]?.lots
              ? [...group[newTag].lots, ...element.lots]
              : [...element.lots]
          }

          return group
        },
        {}
      )

      result = {
        ...result,
        [identifier]: {
          ...resultGrouped
        }
      }
    }

    const farmsByTag: any = []

    Object.values(result).map((element: any) => {
      i = this.processingProgressBar(i)

      for (const index in element) {
        farmsByTag.push({
          tag: index,
          identifier: element[index].identifier,
          crops: element[index].crops,
          lots: [...new Set(element[index].lots)],
          cases: element[index].cases
        })
      }
    })

    for (const farm of farmsByTag) {
      const company = await CompanyRepository.findOne({
        identifier: farm.identifier
      })

      if (!company) {
        continue
      }

      farm.companyId = String(company._id)
    }

    await sendLegacyFarmData(0, farmsByTag)
  }

  /**
   * Rollback Command
   */
  public async rollback(): Promise<void> {
    let i: number = 0

    const data = await StorageRepository.get(this.nameFileBackup)

    for (const crop of data.crops) {
      await CropRepository.replaceOne(
        {
          _id: crop._id
        },
        {
          ...crop
        }
      )
    }

    if (data.farms.length > 0) {
      for (const farm of data.farms) {
        await FarmRepository.replaceOne(
          {
            _id: farm._id
          },
          {
            ...farm
          }
        )
      }
    } else {
      await FarmRepository.dropCollection()
    }

    for (const lot of data.lots) {
      await LotRepository.replaceOne(
        {
          _id: lot._id
        },
        {
          ...lot
        }
      )

      i = this.processingProgressBar(i)
    }

    await StorageRepository.delete(this.nameFileBackup)
  }

  public async run() {
    try {
      if (this.rollbackCommand) {
        this.logger.info('Start Process Rollback Farms Legacy')

        await this.rollback()
      } else {
        this.logger.info('Start Process Update Farms Legacy Data All Cases')

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
