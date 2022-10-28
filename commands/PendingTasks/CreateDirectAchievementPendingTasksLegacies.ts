import { BaseCommand, flags } from '@adonisjs/core/build/standalone'
import axios from 'axios'

import CropRepository from 'App/Core/Crop/Infrastructure/Mongoose/Repositories'
import StorageRepository from 'App/Core/Storage'
import { sendLegacyPendingTasks } from 'App/Core/utils/PendingTasks'
import Env from '@ioc:Adonis/Core/Env'

export default class CreateDirectAchievementPendingTasksLegacies extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'create:directAchievementPendingTasksLegacies'

  /**
   * Command description is displayed in the "help" output
   */
  public static description =
    'This command is used for create all pending tasks for direct achievements legacies'

  @flags.boolean({ alias: 'r', description: 'Rollback flag' })
  public rollbackCommand: boolean

  private nameFileBackup: string =
    'create-pending-tasks-direct-achievements-legacies.json'

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

  /**
   * Execute Command
   */
  public async execute(): Promise<void> {
    this.logger.info('SEARCHING DATA...')

    const queryToFindCrop: any = {
      cancelled: {
        $ne: true
      }
    }

    const populateToFindCropWithDirectAchievements: any = [
      {
        path: 'done',
        match: {
          isRejected: {
            $ne: true
          },
          isDirectAchievement: true,
          'signers.signed': false
        }
      }
    ]

    const cropsWithDirectAchievements: any = (
      await CropRepository.findAll(
        queryToFindCrop,
        populateToFindCropWithDirectAchievements
      )
    ).filter((crop) => crop.done.length)

    const populateToFindCropWithoutCanPlanning: any = [
      {
        path: 'done',
        match: {
          isRejected: {
            $ne: true
          },
          'signers.signed': false
        },
        populate: [
          {
            path: 'type',
            match: {
              canPlanning: false,
              tag: {
                $ne: 'ACT_VERIFICATION'
              }
            }
          }
        ]
      }
    ]

    const cropsWithoutCanPlanning: any = (
      await CropRepository.findAll(
        queryToFindCrop,
        populateToFindCropWithoutCanPlanning
      )
    ).filter((crop) => {
      crop.done = crop.done.filter((activity) => activity.type)

      return crop.done.length
    })

    this.logger.info('DATA SEARCHED!')

    this.logger.info('BUILDING DATA...')

    const crops: any = [
      ...cropsWithDirectAchievements,
      ...cropsWithoutCanPlanning
    ]

    const dataToSend: any = []

    for (const crop of crops) {
      const cropId = crop._id
      const companyId = crop.company

      for (const activity of crop.done) {
        const activityId = activity._id
        const key = activity.key

        for (const signer of activity.signers) {
          if (signer.signed) {
            continue
          }

          const data = {
            userId: signer.userId,
            cropId,
            activityId,
            companyId,
            key
          }

          dataToSend.push(data)
        }
      }
    }

    this.logger.info('DATA BUILDED!')

    this.logger.info(`ELEMENTS TO CREATE: ${dataToSend.length}`)

    this.logger.info('SENDING DATA TO MS PENDING TASK...')

    const pendingTasks = await sendLegacyPendingTasks(0, dataToSend)

    this.logger.info('DATA CREATED!')

    this.logger.info('STORE DATA FOR ROLLBACK...')

    await StorageRepository.create(
      {
        pendingTasks
      },
      this.nameFileBackup
    )

    this.logger.info('DATA STORED!')
  }

  /**
   * Rollback Command
   */
  public async rollback(): Promise<void> {
    this.logger.info('SEARCHING DATA...')

    const { pendingTasks } = await StorageRepository.get(this.nameFileBackup)

    this.logger.info('DATA SEARCHED!')

    this.logger.info('BUILDING DATA...')

    const pendingTaskIds = pendingTasks.map(({ _id }) => _id)

    this.logger.info('DATA BUILDED!')

    this.logger.info(`ELEMENTS TO DELETE: ${pendingTaskIds.length}`)

    this.logger.info('SENDING DATA TO MS PENDING TASK...')

    const dataToSend: any = {
      pendingTaskIds
    }

    const { status } = await axios.request({
      headers: {},
      method: 'DELETE',
      url: `${Env.get('MS_PENDING_TASK_URL')}/v1/pendingTask`,
      data: dataToSend
    })

    if (status === 200) {
      this.logger.info('DATA DELETED!')

      this.logger.info('DELETING USELESS FILE...')

      await StorageRepository.delete(this.nameFileBackup)

      this.logger.info('FILE DELETED!')
    }
  }

  public async run() {
    try {
      if (this.rollbackCommand) {
        this.logger.info(
          'Start Process Rollback Create Pending Tasks Direct Achievements Legacies'
        )

        await this.rollback()
      } else {
        this.logger.info(
          'Start Process Create Pending Tasks Direct Achievements Legacies Data'
        )

        await this.execute()
      }
    } catch (error) {
      this.logger.error(`Error Message: ${error.message}`)
      this.logger.error(`Error: ${error}`)
    }

    this.logger.logUpdatePersist()
    this.logger.success(
      'Pending Tasks Direct Achievements Legacies data created'
    )
  }
}
