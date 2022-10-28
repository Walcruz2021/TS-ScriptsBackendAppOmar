import { BaseCommand, flags } from '@adonisjs/core/build/standalone'
import CropRepository from 'App/Core/Crop/Infrastructure/Mongoose/Repositories'
import UserRepository from 'App/Core/User/Infrastructure/Mongoose/Repositories'
import RolRepository from 'App/Core/Rol/Infrastructure/Mongoose/Repositories'
import CompanyTypeRepository from 'App/Core/CompanyType/Infrastructure/Mongoose/Repositories'
import {
  ICompanyInUserProps,
  ICompanyProps
} from 'App/Core/Company/Infrastructure/Mongoose/Interfaces/Company.interface'
import { findUsersByCompanyTypePipelines } from 'App/Core/User/utils'
import { addRolInCompanies } from '../../dataset/addRolInCompanies'
import { IRolInCompanyUserDataSet } from 'App/Core/User/Infrastructure/Mongoose/Interfaces'
import { findCropsByUserIdWithRolPipelines } from 'App/Core/Crop/utils'
import StorageService from 'App/Core/Storage/Services/StorageService'
import { CompanyTypeEnum } from 'App/Core/CompanyType/Infrastructure/enums/CompanyType.enum'
import { CompanyType } from 'App/Core/CompanyType/Infrastructure/Mongoose/Interfaces'
import { validateEmail } from 'App/utils'

const NONE_ROL = 'NONE'

export default class AddCompanyRoleByCropMembershipOnyKAM extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'users:update:company:with:rol'

  /**
   * Command description is displayed in the "help" output
   */
  public static description =
    'Add roles by company depending on the role in the crop.'

  private userId: string = ''
  private nameFileUsersBackup: string =
    'usersUpdateCompanyWithRolUsersBackup.json'

  private rolSelected: IRolInCompanyUserDataSet = {
    rolValue: null,
    equivalentRoleValue: null,
    companyTypeValue: null
  }

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

  public async run() {
    // this.logger.info('Started adding user roles for companies.')
    this.logger.info('No Execute.')
    await this.exit()
    try {
      if (this.rollbackCommand) {
        this.logger.success('Started rollback roles')
        await this.rollback()
      } else {
        await this.execute()
      }
    } catch (error) {
      this.logger.error(`Error Message: ${error.message}`)
      this.logger.error(`Error: ${error}`)
    }
    this.logger.logUpdatePersist()
    this.logger.success('Add user roles for companies finished.')
  }

  public async execute(): Promise<void> {
    const rolesDataSet = addRolInCompanies.map((rol) => rol.rolValue)
    rolesDataSet.push(NONE_ROL)
    const selectedRolName = await this.prompt.choice(
      'Select a role',
      rolesDataSet
    )
    if (selectedRolName === NONE_ROL) {
      this.exit()
    }
    this.rolSelected = addRolInCompanies.find(
      (rol) => rol.rolValue === selectedRolName
    ) as IRolInCompanyUserDataSet
    this.rolSelected.companyType = await CompanyTypeRepository.findOne({
      name: this.rolSelected.companyTypeValue
    })
    if (!this.rolSelected.companyType) {
      this.logger.error(
        `Error: Company type: <${this.rolSelected.companyTypeValue}>. Not Found`
      )
      this.exit()
    }
    this.rolSelected.rolCrop = await RolRepository.findOne({
      type: this.rolSelected.rolValue
    })
    if (!this.rolSelected.rolCrop) {
      this.logger.error(`Error: Rol: <${this.rolSelected.rolValue}>. Not Found`)
      this.exit()
    }
    this.rolSelected.rolCompany = await RolRepository.findOne({
      equivalentRole: this.rolSelected.rolValue
    })
    if (!this.rolSelected.rolCompany) {
      this.logger.error(
        `Error: Equivalent Role: <${this.rolSelected.rolValue}>. Not Found`
      )
      this.exit()
    }
    const withUser = await this.prompt.toggle(
      'You want to update only one user?',
      ['Yes', 'Not']
    )
    if (withUser) {
      const email = await this.prompt.ask('Enter the email user', {
        validate: validateEmail
      })
      const user = await UserRepository.findOne({ email })
      if (!user) {
        this.logger.error(`User <${email}>`)
        await this.exit()
      }
      this.userId = user?._id.toString()
    }

    await StorageService.create([], this.nameFileUsersBackup)
    await this.asyncLoopsChunkUsers()
  }

  public async rollback(): Promise<void> {
    try {
      let i: number = 0
      const rolesDataSet = addRolInCompanies.map((rol) => rol.rolValue)
      rolesDataSet.push(NONE_ROL)
      const selectedRolName = await this.prompt.choice(
        'Select the role to rollback',
        rolesDataSet
      )
      if (selectedRolName === NONE_ROL) {
        this.exit()
      }
      const users = await StorageService.get(this.nameFileUsersBackup)
      for (const user of users) {
        i = this.processingProgressBar(i, users.length)
        await this.updateCompaniesInUser(user._id, user.companies)
      }
    } catch (err) {
      this.logger.error(err)
      this.exit()
    }
  }

  private async asyncLoopsChunkUsers(): Promise<void> {
    try {
      let index = 0
      const companyType: CompanyType | undefined = this.rolSelected.companyType
      const users: any[] = await UserRepository.findWithAggregate(
        findUsersByCompanyTypePipelines(
          companyType?.name as unknown as CompanyTypeEnum,
          this.userId
        )
      )
      if (!users.length) {
        this.logger.info(
          `Users Not Found for companyType ${companyType?.name} rol ${this.rolSelected.rolValue}`
        )
        await this.exit()
      }
      for (const user of users) {
        await StorageService.add(user, this.nameFileUsersBackup)
        const { companies: companiesInUser, companiesWithType } = user
        const companies = companiesWithType.map((company) => {
          const currentCompany = companiesInUser.find(
            (item) => item?.company?.toString() === company?._id?.toString()
          )
          return {
            ...currentCompany,
            company
          }
        })
        const updateCompanies = await this.asyncLoopsChunkCompanies(
          user,
          companies
        )
        if (updateCompanies.length) {
          await this.updateCompaniesInUser(user._id, [
            ...companiesInUser,
            ...updateCompanies
          ])
        }
        index = this.processingProgressBar(index, users.length)
      }
    } catch (err) {
      console.log('asyncLoopsChunkUsers > helperChunk ERROR')
      this.logger.error(err)
      await this.exit()
    }
  }

  private async asyncLoopsChunkCompanies(
    user,
    companies: ICompanyInUserProps[]
  ): Promise<ICompanyInUserProps[] | any> {
    try {
      return new Promise((resolve) => {
        const { rolCompany } = this.rolSelected
        let updateCompanies: ICompanyInUserProps[] = []
        const helperChunk = async (index, companiesLength, cb) => {
          if (index === companiesLength) {
            return cb(updateCompanies)
          }
          const company = companies[index].company as unknown as ICompanyProps
          updateCompanies.push({
            ...companies[index],
            role: rolCompany?._id
          })
          let results: any[] = await CropRepository.findWithAggregate(
            findCropsByUserIdWithRolPipelines(
              user?._id,
              company.identifier,
              // @ts-ignore
              company?.country?.alpha3Code
            )
          )
          results.forEach((producerCompany) => {
            updateCompanies.push({
              company: producerCompany._id,
              identifier: producerCompany.identifier,
              isAdmin: false,
              role: rolCompany?._id
            })
          })

          await helperChunk(index + 1, companies.length, cb)
        }
        helperChunk(0, companies.length, (results) => resolve(results))
      })
    } catch (err) {
      this.logger.info('Erro > asyncLoopsChunkCompanies')
      this.logger.error(err)
      await this.exit()
    }
  }

  private removeDuplicateCompaniesInUser(
    companies: ICompanyInUserProps[]
  ): ICompanyInUserProps[] | any {
    try {
      return companies.reduce((prevCompanies, company) => {
        const prevCompany = prevCompanies.find(
          (item: ICompanyInUserProps) =>
            String(item?.company) === String(company?.company)
        )
        if (!prevCompany) {
          // @ts-ignore
          prevCompanies.push(company)
        }
        return prevCompanies
      }, [])
    } catch (err) {
      this.logger.info('Error > removeDuplicateCompaniesInUser')
      this.logger.error(err)
      this.exit()
    }
  }

  private async updateCompaniesInUser(
    userId,
    companies: ICompanyInUserProps[]
  ) {
    try {
      const query = {
        _id: userId
      }
      const dataToUnSet = {
        companies: this.removeDuplicateCompaniesInUser(companies)
      }
      // @ts-ignore
      await UserRepository.findOneAndUpdate(query, { $set: dataToUnSet })
    } catch (err) {
      this.logger.info('Error > updateCompaniesInUser')
      this.logger.error(err)
      await this.exit()
    }
  }
}
