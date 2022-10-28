import { BaseCommand, flags } from '@adonisjs/core/build/standalone'
import Env from '@ioc:Adonis/Core/Env'
import { ActivityRepositoryContract } from 'App/Core/Activity/Infrastructure/Contracts'
import { StorageContract } from 'App/Core/Storage/Contracts'
import { CropRepositoryContract } from 'App/Core/Crop/Infrastructure/Contracts'
import LotRepository from 'App/Core/Lot/Infrastructure/Mongoose/Repositories'
import ActivityTypeRepository from 'App/Core/ActivityType/Infrastructure/Mongoose/Repositories'
import UnitTypeRepository from 'App/Core/UnitType/Infrastructure/Mongoose/Repositories'
import TypeAgreementRepository from 'App/Core/TypeAgreement/Infrastructure/Mongoose/Repositories'
import UserRepository from 'App/Core/User/Infrastructure/Mongoose/Repositories'
import SupplyRepository from 'App/Core/Supply/Infrastructure/Mongoose/Repositories'
import SubTypeActivityRepository from 'App/Core/SubTypeActivity/Infrastructure/Mongoose/Repositories'
import Firebase from '@ioc:Firebase'
import { v4 as uuidv4 } from 'uuid'
import ObjectID from 'bson-objectid'
import axios from 'axios'
import Aws from '@ioc:Aws'

export default class AddActivitiesAchievements extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'add:activities:achievements'

  /**
   * Command description is displayed in the "help" output
   */
  public static description = 'This command add activities and achievements'

  @flags.boolean({ alias: 'r', description: 'Rollback flag' })
  public rollbackCommand: boolean

  private nameFileBackup: string = 'add-activities-achievements.json'
  private activityRepo: ActivityRepositoryContract
  private storageRepo: StorageContract
  private cropRepo: CropRepositoryContract

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

  private async setRepositories() {
    const { default: ActivityRepository } = await import(
      '@ioc:Ucropit/Core/ActivityRepository'
    )
    const { default: StorageRepository } = await import(
      '@ioc:Ucropit/Core/StorageRepository'
    )
    const { default: CropRepository } = await import(
      '@ioc:Ucropit/Core/CropRepository'
    )

    this.activityRepo = ActivityRepository
    this.storageRepo = StorageRepository
    this.cropRepo = CropRepository
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
    this.logger.success('Started add activities and achievements')
    await this.setRepositories()
    try {
      if (this.rollbackCommand) {
        this.logger.success(
          'Started rollback from add activities and achievements'
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
    this.logger.success('Add activities and achievements Success')
  }

  private async pushFirebase(data) {
    const firebase = await Firebase.firestore().collection('drafts').add(data)
    return firebase
  }

  private async firebaseSignersDto(validateSigners) {
    let arrSigner: any[] = []
    for (const signer of validateSigners) {
      let signerDTO: any = {}
      signerDTO.userId = signer.userId
      signerDTO.fullName = signer.fullName
      signerDTO.email = signer.email
      signerDTO.type = signer.type

      arrSigner.push(signerDTO)
    }

    return arrSigner
  }

  private async firebaseLotsDto(lots) {
    let arrLots: any[] = []
    for (const lot of lots) {
      let lotsDTO: any = {}
      lotsDTO._id = lot._id.toString()
      lotsDTO.surface = lot.surface
      lotsDTO.tag = lot.tag
      lotsDTO.wktFormat = lot.wktFormat

      arrLots.push(lotsDTO)
    }

    return arrLots
  }

  private async firebaseLotsAchievementsDto(lots, activity) {
    let arrLotsData: any[] = []
    let arrLotsWithSurface: any[] = []
    let i = 0
    let surfaceAchievement
    if (activity.surfaceAchievement) {
      surfaceAchievement = activity.surfaceAchievement
        .split(';')
        .map((item) => item.trim())
    }
    for (const lot of lots) {
      let lotsData: any = {}
      let lotsWithSurface: any = {}

      lotsData._id = lot._id
      lotsData.wktFormat = lot.wktFormat

      lotsWithSurface._id = lot._id
      lotsWithSurface.surfaceAchievement = lot.surface

      if (activity.surfaceAchievement && surfaceAchievement[i]) {
        lotsWithSurface.surfaceAchievement = surfaceAchievement[i]
      }

      arrLotsData.push(lotsData)
      arrLotsWithSurface.push(lotsWithSurface)
      i++
    }

    return { arrLotsData, arrLotsWithSurface }
  }

  public async execute(): Promise<void> {
    let now = new Date()
    let i: number = 0
    let listBackup: Array<Object> = []
    let surface
    let firebaseSigners
    let firebaseLots

    const bucket = await this.prompt.ask('Enter the bucket', {
      validate: this.validate
    })
    const key = await this.prompt.ask('Enter the key', {
      validate: this.validate
    })

    let data = await this.getFile(bucket, key)
    let addActivities = JSON.parse(data.body.toString('utf-8'))

    for (const activity of addActivities) {
      let validateCrop = await this.validateCrop(activity)

      if (validateCrop) {
        let validateLots = await this.validateLots(validateCrop.lots, activity)
        let validateActivityType = await this.validateActivityType(activity)
        let validateSigners = await this.validateSigners(activity, validateCrop)

        if (validateLots && validateActivityType && validateSigners) {
          surface = this.calculateSurface(validateLots)
          firebaseSigners = await this.firebaseSignersDto(validateSigners)
          firebaseLots = await this.firebaseLotsDto(validateLots)

          switch (activity.tag) {
            case 'ACT_HARVEST':
              let validateUnitType = await this.validateUnitType(activity)

              if (validateUnitType) {
                const activityHarvestDTO: any = {
                  _id: new ObjectID().toString(),
                  dateHarverst: new Date(activity.dateHarverst!),
                  surface: surface,
                  tag: activity.tag,
                  crop: activity.cropId,
                  pay: activity.pay,
                  lots: firebaseLots,
                  signers: firebaseSigners,
                  createdAt: now,
                  updatedAt: now,
                  version: 1,
                  hasMoreVersion: false,
                  draftGroupId: uuidv4(),
                  groupActivity: uuidv4(),
                  unitType: validateUnitType._id.toString()
                }

                await this.pushFirebase(activityHarvestDTO)

                const activityHarvestBackup = {
                  draftId: activityHarvestDTO._id,
                  type: 'activityHarvestDraft'
                }

                listBackup.push(activityHarvestBackup)
              }

              break

            case 'ACT_MONITORING':
              let validateUnitTypeMonitoring = await this.validateUnitType(
                activity
              )

              if (validateUnitTypeMonitoring) {
                const activityMonitoringDTO: any = {
                  _id: new ObjectID().toString(),
                  dateEstimatedHarvest: new Date(
                    activity.dateEstimatedHarvest!
                  ),
                  dateObservation: new Date(activity.dateObservation!),
                  observation: activity.observation,
                  surface: surface,
                  tag: activity.tag,
                  crop: activity.cropId,
                  lots: firebaseLots,
                  signers: firebaseSigners,
                  createdAt: now,
                  updatedAt: now,
                  version: 1,
                  hasMoreVersion: false,
                  draftGroupId: uuidv4(),
                  groupActivity: uuidv4(),
                  pay: activity.pay,
                  unitType: validateUnitTypeMonitoring._id.toString()
                }

                await this.pushFirebase(activityMonitoringDTO)

                const activityMonitoringBackup = {
                  draftId: activityMonitoringDTO._id,
                  type: 'activityMonitoringDraft'
                }

                listBackup.push(activityMonitoringBackup)
              }

              break
            case 'ACT_AGREEMENTS':
              let validateTypeAgreement = await this.validateTypeAgreement(
                activity
              )

              if (validateTypeAgreement) {
                const activityAgreementsDTO: any = {
                  _id: new ObjectID().toString(),
                  surface: surface,
                  tag: activity.tag,
                  crop: activity.cropId,
                  lots: firebaseLots,
                  signers: firebaseSigners,
                  createdAt: now,
                  updatedAt: now,
                  version: 1,
                  hasMoreVersion: false,
                  draftGroupId: uuidv4(),
                  groupActivity: uuidv4(),
                  typeAgreement: validateTypeAgreement._id.toString()
                }

                await this.pushFirebase(activityAgreementsDTO)

                const activityAgreementsBackup = {
                  draftId: activityAgreementsDTO._id,
                  type: 'activityAgreementsDraft'
                }

                listBackup.push(activityAgreementsBackup)
              }
              break

            default:
              let lotsId = validateLots.map((lot) => lot._id.toString())
              let validateSupplies = await this.validateSupplies(
                activity,
                surface
              )
              let subTypeActivity
              if (validateSupplies) {
                const activityDTO: any = {
                  name: activity.name,
                  dateStart: activity.dateStart,
                  dateEnd: activity.dateEnd,
                  surface: surface,
                  type: validateActivityType._id,
                  tag: activity.tag,
                  crop: activity.cropId,
                  lots: lotsId,
                  signers: validateSigners,
                  supplies: validateSupplies,
                  status: 'PLANNED'
                }

                if (activity.keySubTypesActivity) {
                  subTypeActivity = await this.validateSubTypeActivity(activity)
                  activityDTO.subTypeActivity = subTypeActivity._id
                }

                let data = { data: JSON.stringify(activityDTO) }

                const ActivityDocument = await axios
                  .post(`${Env.get('CORE_URL')}/v1/activities`, data, {
                    headers: {
                      'Content-Type': 'application/json',
                      Authorization: `bearer ${Env.get('CORE_TOKEN')}`
                    }
                  })
                  .catch((err) => err)

                if (ActivityDocument.isAxiosError) {
                  this.logger.error(
                    `Error in create for activity ${activity.name} `
                  )
                  break
                }
                const { arrLotsData, arrLotsWithSurface } =
                  await this.firebaseLotsAchievementsDto(firebaseLots, activity)

                const achievementDTO: any = {
                  _id: new ObjectID().toString(),
                  activity: ActivityDocument.data._id.toString(),
                  dateAchievement: new Date(activity.dateAchievement!),
                  surface: surface,
                  tag: activity.tag,
                  crop: activity.cropId,
                  lots: lotsId,
                  lotsData: arrLotsData,
                  lotsWithSurface: arrLotsWithSurface,
                  signers: firebaseSigners,
                  createdAt: now,
                  updatedAt: now,
                  supplies: [],
                  version: 1,
                  hasMoreVersion: false,
                  draftGroupId: uuidv4(),
                  groupActivity: ActivityDocument.data._id.toString()
                }

                if (subTypeActivity) {
                  achievementDTO.subTypeActivity =
                    subTypeActivity._id.toString()
                }

                await this.pushFirebase(achievementDTO)

                const activityBackup = {
                  activityId: ActivityDocument.data._id.toString(),
                  type: 'activity'
                }
                const achievementDraftBackup = {
                  draftId: achievementDTO._id,
                  type: 'achievementDraft'
                }

                listBackup.push(activityBackup)
                listBackup.push(achievementDraftBackup)
              }

              break
          }
        }
      }

      i = this.processingProgressBar(i, addActivities.length)
    }

    await this.storageRepo.create(listBackup, this.nameFileBackup)
  }

  /**
   * Rollback Command
   */
  public async rollback(): Promise<void> {
    let i: number = 0
    const data = await this.storageRepo.get(this.nameFileBackup)

    for (const item of data) {
      if (item.type === 'activity') {
        await this.activityRepo.deleteOne({
          _id: item.activityId
        })
      }
      if (item.type === 'activityAgreementsDraft') {
        let findDocument = await Firebase.firestore()
          .collection('drafts')
          .where('_id', '==', item.draftId)
          .get()

        if (findDocument.size === 1) {
          await Firebase.firestore()
            .collection('drafts')
            .doc(findDocument.docs[0].id)
            .delete()
        }
      }
      if (item.type === 'activityMonitoringDraft') {
        let findDocument = await Firebase.firestore()
          .collection('drafts')
          .where('_id', '==', item.draftId)
          .get()

        if (findDocument.size === 1) {
          await Firebase.firestore()
            .collection('drafts')
            .doc(findDocument.docs[0].id)
            .delete()
        }
      }
      if (item.type === 'activityHarvestDraft') {
        let findDocument = await Firebase.firestore()
          .collection('drafts')
          .where('_id', '==', item.draftId)
          .get()

        if (findDocument.size === 1) {
          await Firebase.firestore()
            .collection('drafts')
            .doc(findDocument.docs[0].id)
            .delete()
        }
      }
      if (item.type === 'achievementDraft') {
        let findDocument = await Firebase.firestore()
          .collection('drafts')
          .where('_id', '==', item.draftId)
          .get()

        if (findDocument.size === 1) {
          await Firebase.firestore()
            .collection('drafts')
            .doc(findDocument.docs[0].id)
            .delete()
        }
      }

      i = this.processingProgressBar(i, data.length)
    }

    await this.storageRepo.delete(this.nameFileBackup)
  }

  private calculateSurface(lots: any[]) {
    let surface = 0

    for (const lot of lots) {
      surface += lot.surface
    }

    return surface
  }

  private async validateCrop(activity) {
    const crop = await this.cropRepo.findOne({ _id: activity.cropId.trim() })
    if (!crop) {
      this.logger.log(
        `crop for activity ${activity.name} not found with cropId ${activity.cropId} `
      )
      return false
    }
    return crop
  }

  private async validateLots(lotsCrop, activity) {
    let arrLots: any = []
    let lots: any = activity.lots.split(';').map((item) => item.trim())

    for (const lotData of lots) {
      let findLotsId = (await LotRepository.findAll({ name: lotData })).map(
        (lot) => lot._id
      )

      if (findLotsId) {
        let idMatch = await findLotsId.find((id) =>
          lotsCrop.find((lot) => lot.data.includes(id))
        )

        if (idMatch) {
          let lotResult = await LotRepository.findOne({ _id: idMatch })
          let findLotInCrop = lotsCrop.find((lot) =>
            lot.data.map((dataLot) => dataLot.toString() === idMatch.toString())
          )
          lotResult.tag = findLotInCrop.tag
          arrLots.push(lotResult)
        }
      }
    }

    if (arrLots.length !== lots.length) {
      this.logger.log(`lots for activity ${activity.name} not found`)
      this.logger.log(`lots for activity ${activity.name} not found`)

      return false
    }
    return arrLots
  }
  private async validateActivityType(activity) {
    const activityType: any = await ActivityTypeRepository.findOne({
      tag: activity.tag
    })

    if (!activityType) {
      this.logger.log(
        `Tag for activity ${activity.name} not found with tag ${activity.tag}`
      )
      return false
    }
    return activityType
  }
  private async validateSigners(activity, validateCrop) {
    let arrUsers: any = []
    let users: any = activity.signers.split(';').map((item) => item.trim())

    for (const user of users) {
      const userResult: any = await UserRepository.findOne({
        email: user
      })

      if (userResult) {
        let signersDTO: any = {}
        let member = validateCrop.members.find(
          (member) => member.user._id.toString() === userResult._id.toString()
        )
        signersDTO.userId = userResult._id.toString()
        signersDTO.fullName = userResult.firstName + ' ' + userResult.lastName
        signersDTO.email = userResult.email
        signersDTO.signed = userResult.signed
        signersDTO.type = member.type
        arrUsers.push(signersDTO)
      }
    }

    if (arrUsers.length !== users.length) {
      this.logger.log(`signers for activity ${activity.name} not found`)
      return false
    }
    return arrUsers
  }
  private async validateSubTypeActivity(activity) {
    const subTypeActivity: any = await SubTypeActivityRepository.findOne({
      key: activity.keySubTypesActivity
    })

    if (!subTypeActivity) {
      this.logger.log(
        `SubType Activity for activity ${activity.name} not found with subType ${activity.keySubTypesActivity}`
      )
      return false
    }
    return subTypeActivity
  }
  private async validateSupplies(activity, surface) {
    let arrSupplies: any = []
    let suppliesGeneral = activity.supplies.split(';')

    for (const supply of suppliesGeneral) {
      let suppliesObject = supply.split(',').map((item) => item.trim())
      let total = suppliesObject[2]

      let supplyResult: any = await SupplyRepository.findOne({
        brand: suppliesObject[0],
        name: suppliesObject[1]
      })

      if (supplyResult) {
        supplyResult._doc.supply = supplyResult._id.toString()
        supplyResult._doc.total = total
        supplyResult._doc.quantity = total / surface
        arrSupplies.push(supplyResult)
      }
    }

    if (arrSupplies.length !== suppliesGeneral.length) {
      this.logger.log(`supplies for activity ${activity.name} not found`)
      return false
    }
    return arrSupplies
  }

  private async validateUnitType(activity) {
    const unitType: any = await UnitTypeRepository.findOne({
      $or: [{ 'name.en': activity.unitType }, { 'name.es': activity.unitType }]
    })

    if (!unitType) {
      this.logger.log(
        `Unit Type for activity ${activity.name} not found with unit type ${activity.unitType}`
      )
      return false
    }
    return unitType
  }

  private async validateTypeAgreement(activity) {
    const TypeAgreement: any = await TypeAgreementRepository.findOne({
      $or: [
        { 'name.en': activity.typeAgreement },
        { 'name.es': activity.typeAgreement }
      ]
    })

    if (!TypeAgreement) {
      this.logger.log(
        `Type Agreement for activity ${activity.name} not found with Type Agreement ${activity.typeAgreement}`
      )
      return false
    }
    return TypeAgreement
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

  private async validate(data: string): Promise<string | boolean> {
    if (!data) {
      return 'Can not be empty'
    }
    return true
  }
}
