import { BaseCommand, flags } from '@adonisjs/core/build/standalone'
import StorageRepository from 'App/Core/Storage'
import CropTypeRepository from 'App/Core/CropType/Infraestructure/Mongoose/Repositories'
import { cropTypeEquivalences } from '../../dataset/cropTypeEquivalences'

export default class UpdateEquivalenceInCropType extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'update:equivalence:in:cropType'

  private nameFileBackup: string = 'update-cropType-equivalences.json'

  /**
   * Command description is displayed in the "help" output
   */
  public static description = 'update equivalences in cropType'
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

  public async rollback(): Promise<void> {
    let i: number = 0
    const data = await StorageRepository.get(this.nameFileBackup)

    for (const item of data) {
      if (item.status === 'new') {
        const key = item.key.toLowerCase()
        await CropTypeRepository.deleteOne({ key })
      } else {
        await CropTypeRepository.updateOne(
          {
            key: item.key
          },
          { ...item }
        )
      }
      i = this.processingProgressBar(i, data.length)
    }

    //await StorageRepository.delete(this.nameFileBackup)
  }

  public async execute(): Promise<void> {
    let i = 0

    const cropTypes = await CropTypeRepository.findAll({})

    let resultBack: any[] = []

    for (const item of cropTypeEquivalences) {
      const cropTypeEquivalence = cropTypes.find(
        (cropType) => item.key.toLowerCase() === cropType.key.toLowerCase()
      )

      if (!item.unit || !item.value) {
        this.logger.error(`Error Message: equivalence in ${item.key} is null.`)
        continue
      }

      const dataToUpdate = [
        {
          unit: item.unit,
          value: item.value
        }
      ]

      if (!cropTypeEquivalence) {
        this.logger.error(`Error Message: CropType ${item.key} not found.`)
        i = this.processingProgressBar(i, cropTypeEquivalences.length)

        const newCropType = {
          name: {
            es: item.es,
            en: item.en
          },
          key: item.key.toLowerCase(),
          _v: 0,
          equivalences: dataToUpdate
        }

        const cropTypeResult = {
          ...(await CropTypeRepository.create(newCropType)).toJSON(),
          status: 'new'
        } as any
        resultBack.push(cropTypeResult)
      } else {
        const cropTypeEquivalenceFound = {
          ...cropTypeEquivalence.toJSON(),
          status: 'edit'
        }
        resultBack.push(cropTypeEquivalenceFound)

        const nameCropType = {
          es: item.es,
          en: item.en
        }

        await CropTypeRepository.updateOne(
          {
            _id: cropTypeEquivalence._id
          },
          { $set: { equivalences: dataToUpdate, name: nameCropType } }
        )
      }

      i = this.processingProgressBar(i, cropTypeEquivalences.length)
    }

    if (resultBack.length) {
      await StorageRepository.create(resultBack, this.nameFileBackup)
    }
  }

  public async run() {
    this.logger.success('Started update crop type with equivalences')
    try {
      if (this.rollbackCommand) {
        this.logger.success('Started rollback update crop type')
        await this.rollback()
      } else {
        await this.execute()
      }
    } catch (error) {
      this.logger.error(`Error Message: ${error.message}`)
      this.logger.error(`Error: ${error}`)
    }
    this.logger.logUpdatePersist()
    this.logger.success('update crop type with equivalences Success')
  }
}
