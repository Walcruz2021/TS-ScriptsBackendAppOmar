import { BaseCommand, flags } from '@adonisjs/core/build/standalone'
import { CompanyRepositoryContract } from 'App/Core/Company/Infrastructure/Contracts'
import { StorageContract } from 'App/Core/Storage/Contracts'
import CompanyRepository from 'App/Core/Company/Infrastructure/Mongoose/Repositories'
import StorageRepository from 'App/Core/Storage'
import CompanyTypeRepository from 'App/Core/CompanyType/Infrastructure/Mongoose/Repositories'
import { CompanyTypeEnum } from 'App/Core/CompanyType/Infrastructure/enums/CompanyType.enum'
import { CompanyTypeDocument } from 'App/Core/CompanyType/Infrastructure/Mongoose/Interfaces'
export default class UpdateTypeCompany extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'update:type:company'

  /**
   * Command description is displayed in the "help" output
   */
  public static description =
    'This command updated to type of companies according to file'

  /**
   * Command rollback flag
   */
  @flags.boolean({ alias: 'r', description: 'Rollback flag' })
  public rollbackCommand: boolean

  /**
   * Name file backup
   */
  private nameFileBackup = 'companies-updated-backup.json'

  /**
   * CompanyRepository
   */
  private companyRepo: CompanyRepositoryContract

  /**
   * StorageRepository
   */
  private storageRepo: StorageContract

  private companyDataToUpdate = [
    { taxId: '30608663815', typeCompany: CompanyTypeEnum.VERIFIERS },
    { taxId: '30619765555', typeCompany: CompanyTypeEnum.UCROPIT },
    { taxId: '801174732', typeCompany: CompanyTypeEnum.UCROPIT },
    { taxId: '33678814119', typeCompany: CompanyTypeEnum.VERIFIERS },
    { taxId: '30616275905', typeCompany: CompanyTypeEnum.PROVIDER },
    { taxId: '30716158507', typeCompany: CompanyTypeEnum.TRADERS },
    { taxId: '30715950797', typeCompany: CompanyTypeEnum.TRADERS },
    { taxId: '30708583819', typeCompany: CompanyTypeEnum.TRADERS },
    { taxId: '30589527115', typeCompany: CompanyTypeEnum.PROVIDER },
    { taxId: '30517486678', typeCompany: CompanyTypeEnum.PROVIDER },
    { taxId: '30715361848', typeCompany: CompanyTypeEnum.PROVIDER }
  ]

  /**
   * Calculate progress bar.
   *
   * @param number currentPercentage
   *
   * @return string
   */
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
   * Progress bar.
   *
   * @param number index
   * @param number limit
   *
   * @return number
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

  private async createTypeCompany(
    typeCompany: string
  ): Promise<CompanyTypeDocument> {
    const companyTypeDTO = {
      name: typeCompany,
      __v: 0
    }
    return await CompanyTypeRepository.create(companyTypeDTO)
  }

  /*
   * Set Repositories to use command.
   */
  private async setRepositories(): Promise<void> {
    this.companyRepo = CompanyRepository
    this.storageRepo = StorageRepository
  }

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

  private async execute(): Promise<void> {
    let index = 0
    const errors: string[] = []
    let companyTypes = await CompanyTypeRepository.findAll({})
    const allCompanies: any = await CompanyRepository.findAll({})
    for (let element of allCompanies) {
      const { types = [] } = element
      const companyTemp = {
        identifier: element.taxId,
        types
      }

      let dataUpdateyDTO = {
        taxId: element.taxId,
        typeCompany: CompanyTypeEnum.PRODUCER
      }
      const companyDataToAssign = this.companyDataToUpdate.find(
        (item) => item.taxId === element.identifier
      )
      if (companyDataToAssign) {
        dataUpdateyDTO.typeCompany = companyDataToAssign.typeCompany
      }

      let typeCompanySelect = companyTypes.find(
        (item) => item.name === dataUpdateyDTO.typeCompany
      )
      if (!typeCompanySelect) {
        typeCompanySelect = await this.createTypeCompany(
          dataUpdateyDTO.typeCompany
        )
        companyTypes.push(typeCompanySelect)
      }
      types.push(typeCompanySelect?._id)
      const typesFilter = types.reduce((acc: string[], current) => {
        if (!acc.includes(String(current))) {
          acc.push(String(current))
        }
        return acc
      }, [])

      await this.companyRepo.updateOne(
        { identifier: element.identifier },
        { $set: { types: typesFilter } }
      )
      await this.storageRepo.create(companyTemp, this.nameFileBackup)
      index = this.processingProgressBar(index, allCompanies.length)
    }

    errors.forEach((message) => this.logger.warning(message))
    this.logger.success('All complete!!')
  }

  /**
   * Rollback command.
   */
  private async rollback(): Promise<void> {
    let index = 0
    const data = await this.storageRepo.get(this.nameFileBackup)

    for (const item of data) {
      await this.companyRepo.updateOne(
        { identifier: item.identifier },
        { types: item.types }
      )
      index = this.processingProgressBar(index, this.companyDataToUpdate.length)
    }

    await this.storageRepo.delete(this.nameFileBackup)
  }

  public async run() {
    await this.setRepositories()
    if (this.rollbackCommand) {
      this.logger.info('Execute Command rollback')
      await this.rollback()
    } else {
      this.logger.info('Execute Command')
      await this.execute()
    }
  }
}
