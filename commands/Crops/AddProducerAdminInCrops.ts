import { BaseCommand, flags } from '@adonisjs/core/build/standalone'
import { existsSync } from 'fs'
import RolRepository from 'App/Core/Rol/Infrastructure/Mongoose/Repositories'
import CompanyRepository from 'App/Core/Company/Infrastructure/Mongoose/Repositories'
import CropRepository from 'App/Core/Crop/Infrastructure/Mongoose/Repositories'
import { ERoles } from '../../app/Core/Rol/Infrastructure/Interfaces/Rol.enum'
import StorageService from '../../app/Core/Storage/Services/StorageService'
import { getCompaniesWithCropsByUserRole } from '../../app/Core/Company/utils/findCompanyWithCropsByRole'

export default class AddProducerAdminInCrops extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'add:producer:admin:in:crops'

  /**
   * Command description is displayed in the "help" output
   */
  public static description = 'Command to add users producers admins in crops'

  private nameFileBackup: string = 'producer-admins-in-crops.json'

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
   * @param limit index
   *
   * @returns
   */
  private processingProgressBar(index: number, limit: number): number {
    if (index < limit) {
      index++
      const currentPercentage = Number(((index * 100) / limit).toFixed(2))
      this.logger.logUpdate(
        `Processing: ${this.getProgressBar(
          currentPercentage
        )} ${currentPercentage}% | ${index}/${limit}`
      )
    }
    return index
  }

  public async rollback(): Promise<void> {
    let index = 0
    let nameFileBackup: string = this.nameFileBackup

    let crops = await StorageService.get(nameFileBackup)

    if (!crops && !crops.length) {
      this.logger.error(`Error: The rollBack data does not exist`)
      this.exit()
    }

    for (const crop of crops) {
      index = this.processingProgressBar(index, crops.length)
      await CropRepository.replaceOne({ _id: crop._id }, { ...crop })
    }
  }

  public async execute(): Promise<void> {
    let membersAdded = 0
    let index = 0
    if (!existsSync(`${process.cwd()}/tmp/${this.nameFileBackup}`)) {
      await StorageService.create([], this.nameFileBackup)
    }

    const producerRole = await RolRepository.findOne({ value: ERoles.PRODUCER })
    if (!producerRole) {
      this.logger.error(`Producer role not exist`)
      this.exit()
    }

    const companies = await CompanyRepository.findWithAggregate(
      getCompaniesWithCropsByUserRole(producerRole._id, true)
    )

    if (!companies.length) {
      this.logger.info(`Companies not found with producer admins`)
      await this.exit()
    }

    for (const company of companies) {
      index = this.processingProgressBar(index, companies.length)
      const { crops, usersWithCondition: producerAdmins } = company
      for (const producerAdmin of producerAdmins) {
        for (const crop of crops) {
          const isCropMember = crop.members.some(
            (member) =>
              String(member.user) === String(producerAdmin.user) &&
              member.identifier === company.identifier
          )

          if (!isCropMember) {
            const backupCrops = await StorageService.get(this.nameFileBackup)

            const alreadyInBackup =
              backupCrops.length &&
              backupCrops.some(
                (backupCrop) => backupCrop._id === String(crop._id)
              )

            if (!alreadyInBackup) {
              await StorageService.add(crop, this.nameFileBackup)
            }
            const memberToAdd = {
              type: producerRole.value,
              producer: true,
              user: producerAdmin.user,
              identifier: company.identifier,
              country: company.country
            }

            await CropRepository.findOneAndUpdate(
              { _id: crop._id },
              { $push: { members: memberToAdd } }
            )
            membersAdded++
          }
        }
      }
    }

    this.logger.info(`members added: ${membersAdded}`)
  }

  public async run() {
    try {
      if (this.rollbackCommand) {
        this.logger.success('Started rollback producer admins')
        await this.rollback()
      } else {
        await this.execute()
      }
    } catch (error) {
      this.logger.error(`Error Message: ${error.message}`)
      this.logger.error(`Error: ${error}`)
    }
    this.logger.logUpdatePersist()
    this.logger.success('Add producer admins in crops finished.')
  }
}
