import { BaseCommand, flags } from '@adonisjs/core/build/standalone'
import CropRepository from 'App/Core/Crop/Infrastructure/Mongoose/Repositories'
import NormativeConfigRepository from 'App/Core/NormativeConfig/Infrastructure/Mongoose/Repositories'
import wkx from 'wkx'
import axios from 'axios'
import { StatusProtectedAreasEnum } from 'App/Core/Crop/enums/StatusProtectedAreas.enum'
import Env from '@ioc:Adonis/Core/Env'
import StorageRepository from 'App/Core/Storage'

export default class VerifyProtectedAreas extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'verify:protected:areas'

  /**
   * Command description is displayed in the "help" output
   */
  public static description = 'verify protected area'
  @flags.boolean({ alias: 'r', description: 'Rollback flag' })
  public rollbackCommand: boolean

  private nameFileBackup: string = 'verify-protected-area.json'
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
    this.logger.success('Started verify protected area')
    try {
      if (this.rollbackCommand) {
        this.logger.success('Started rollback update unit semilla')
        await this.rollback()
      } else {
        await this.execute()
      }
    } catch (error) {
      this.logger.error(`Error Message: ${error.message}`)
      this.logger.error(`Error: ${error}`)
    }
    this.logger.logUpdatePersist()
    this.logger.success('Update verify protected area Success')
  }

  public async execute(): Promise<void> {
    let listBackup: Array<Object> = []

    let crop
    let countCrop = 0
    const pipeline = this.getCropAggregationPipeline()
    const options = {
      batchSize: 10
    }
    const cursor = await CropRepository.findCropsCursor(pipeline, options)

    while ((crop = await cursor.next())) {
      if (!crop?.company) {
        console.log('==============================================')
        console.log('CROP WITHOUT COMPANY')
        console.log(crop._id)
        console.log('IGNORED')
        console.log('==============================================')

        continue
      }

      if (!crop.company?.country) {
        console.log('==============================================')
        console.log('COMPANY WITHOUT COUNTRY')
        console.log(crop.company._id)
        console.log('CROP ID')
        console.log(crop._id)
        console.log('IGNORED')
        console.log('==============================================')

        continue
      }

      if (!crop?.cropType) {
        console.log('==============================================')
        console.log('CROP WITHOUT CROPTYPE')
        console.log(crop._id)
        console.log('IGNORED')
        console.log('==============================================')

        continue
      }

      const normatives =
        await NormativeConfigRepository.getByAlphaCodeAndCropType(
          crop.company.country.alpha3Code,
          crop.cropType.key,
          crop.dateHarvest
        )

      if (!normatives.length) {
        continue
      }

      for (const farm of crop.farms) {
        for (const field of farm.fields) {
          field.polygon = this.geometryDataToWkb(field.polygon)
        }
      }

      const schemes = normatives.map((element, index) => ({
        id: index + 1,
        name: element.normative
      }))

      const dataToSend = {
        cropId: crop._id.toString(),
        farms: crop.farms,
        schemes,
        callBackUrl: `${Env.get('WEBHOOKS_PROTECTED_AREAS_CALLBACK_V1')}`
      }

      try {
        countCrop++
        //this.findFieldsExternal(dataToSend)

        await new Promise((resolve, reject) =>
          axios
            .post(
              `${Env.get('MS_PROTECTED_AREAS_URL')}/v1/schemes/intersections`,
              dataToSend
            )
            .then(({ data }) => resolve(data))
            .catch((err) => reject(this.axiosParseError(err)))
        )
        console.log(new Date(), crop._id, 'DATA SENDING')
        const cropBackup = {
          cropId: dataToSend.cropId
        }
        listBackup.push(cropBackup)
      } catch (err) {
        const queryToUpdateCrop = {
          _id: crop._id
        }
        const dataToUpdateCrop = {
          statusProtectedAreas: StatusProtectedAreasEnum.FAILED
        }
        CropRepository.findOneAndUpdate(
          {
            queryToUpdateCrop
          },
          { dataToUpdateCrop }
        )
      }
      //i = this.processingProgressBar(i, cursorCount)
    }

    console.log('==============================================')
    console.log('DATA SENT CORRECTLY', countCrop)
    console.log('==============================================')
    await StorageRepository.create(listBackup, this.nameFileBackup)
  }

  public getCropAggregationPipeline() {
    const lookupCropType: any = {
      from: 'croptypes',
      let: {
        cropTypeId: '$cropType'
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $eq: ['$_id', '$$cropTypeId']
            }
          }
        }
      ],
      as: 'cropType'
    }

    const lookupCountry: any = {
      from: 'countries',
      let: {
        countryId: '$country'
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $eq: ['$_id', '$$countryId']
            }
          }
        }
      ],
      as: 'country'
    }

    const lookupCompany: any = {
      from: 'companies',
      let: {
        companyId: '$company'
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $eq: ['$_id', '$$companyId']
            }
          }
        },
        {
          $lookup: lookupCountry
        },
        {
          $unwind: {
            path: '$country',
            preserveNullAndEmptyArrays: true
          }
        }
      ],
      as: 'company'
    }

    const lookupLots: any = {
      from: 'lots',
      let: {
        lotsIds: '$lots.data'
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $or: [
                {
                  $in: ['$_id', '$$lotsIds']
                }
              ]
            },
            geometryData: {
              $nin: [undefined]
            },
            'geometryData.type': {
              $eq: 'Polygon'
            }
          }
        },
        {
          $project: {
            _id: 0,
            lotId: '$_id',
            polygon: '$geometryData'
          }
        }
      ],
      as: 'lots.fields'
    }

    const pipelineProject: any = {
      _id: 1,
      dateHarvest: 1,
      company: 1,
      cropType: 1,
      farms: 1
    }

    const pipeline: Array<any> = [
      {
        $match: {
          cancelled: false,
          dateCrop: {
            $gte: new Date('2021-01-01T00:00:00.0Z')
          }
        }
      },
      {
        $redact: {
          $cond: {
            if: {
              $gt: [
                {
                  $size: ['$lots']
                },
                0
              ]
            },
            then: '$$KEEP',
            else: '$$PRUNE'
          }
        }
      },
      {
        $unwind: '$lots'
      },
      {
        $lookup: lookupLots
      },
      {
        $redact: {
          $cond: {
            if: {
              $gt: [
                {
                  $size: ['$lots.fields']
                },
                0
              ]
            },
            then: '$$KEEP',
            else: '$$PRUNE'
          }
        }
      },
      {
        $lookup: lookupCompany
      },
      {
        $unwind: {
          path: '$company',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: lookupCropType
      },
      {
        $unwind: {
          path: '$cropType',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $addFields: {
          farms: {
            key: { $toString: '$lots._id' },
            name: '$lots.tag',
            fields: '$lots.fields'
          }
        }
      },
      {
        $group: {
          _id: '$_id',
          dateHarvest: {
            $first: '$dateHarvest'
          },
          company: {
            $first: '$company'
          },
          cropType: {
            $first: '$cropType'
          },
          farms: {
            $addToSet: '$farms'
          }
        }
      },
      {
        $project: pipelineProject
      }
    ]

    return pipeline
  }

  /**
   * Rollback Command
   */
  public async rollback(): Promise<void> {
    let i: number = 0
    const data = await StorageRepository.get(this.nameFileBackup)

    for (const item of data) {
      await CropRepository.findOneAndUpdate(
        {
          _id: item.cropId
        },
        { statusProtectedAreas: 'NONE' }
      )

      i = this.processingProgressBar(i, data.length)
    }

    await StorageRepository.delete(this.nameFileBackup)
  }

  public geometryDataToWkb(geometryData): string {
    return wkx.Geometry.parseGeoJSON(geometryData).toWkb().toString('hex')
  }
  public async findFieldsExternal(body: GetFieldsExternalDTO) {
    return this.makeRequestSync(
      'post',
      `${Env.get('MS_PROTECTED_AREAS_URL')}/v1/schemes/intersections`,
      body
    )
  }
  public async makeRequestSync(
    method: string,
    url: string,
    body: any,
    headers?: any
  ) {
    return new Promise((resolve, reject) =>
      axios[method](url, body, { headers })
        .then(({ data }) => resolve(data))
        .catch((err) => reject(this.axiosParseError(err)))
    )
  }
  private axiosParseError(err) {
    const { response = {} } = err
    const { status = 500, data = {} } = response
    const { code = status, message = err.toString(), description } = data
    let msg = message
    if (typeof data === 'string') {
      msg = data.toString()
    }
    return {
      status,
      data: {
        ...data,
        code,
        message: msg,
        description
      },
      errorToString: err.toString()
    }
  }
}

interface GetFieldsExternalDTO {
  cropId: string
  farms: IFieldFarms[]
  schemes: IFieldScheme[]
  callBackUrl: string
}
// eslint-disable-next-line @typescript-eslint/naming-convention
interface IFieldFarms {
  key: string
  name: string
  fields: IFieldLot[]
}
// eslint-disable-next-line @typescript-eslint/naming-convention
interface IFieldScheme {
  id: number
  name: string
}
// eslint-disable-next-line @typescript-eslint/naming-convention
interface IFieldLot {
  lotId: string
  polygon: string
}
