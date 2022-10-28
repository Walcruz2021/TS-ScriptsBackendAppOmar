import { BaseCommand, flags } from '@adonisjs/core/build/standalone'
import { updateUsersCazenaveWithUcropit } from '../../dataset/resources/update_user_kam_in_crop/update_user_cazenave.json'
import { updateGaramendyProducers } from '../../dataset/resources/update_user_kam_in_crop/update-garamendy-producers.json'
import CompanyRepository from 'App/Core/Company/Infrastructure/Mongoose/Repositories'
import UserRepository from 'App/Core/User/Infrastructure/Mongoose/Repositories'
import StorageService from 'App/Core/Storage/Services/StorageService'
import RolRepository from 'App/Core/Rol/Infrastructure/Mongoose/Repositories'
import { ERoles } from 'App/Core/Rol/Infrastructure/Interfaces'
import { CompanyTypeEnum } from 'App/Core/CompanyType/Infrastructure/enums/CompanyType.enum'
import CropRepository from 'App/Core/Crop/Infrastructure/Mongoose/Repositories'
import AwsS3Service from 'App/Core/Storage/Services/AwsS3Service'
import { inspect } from 'util'
import CompanyTypeRepository from 'App/Core/CompanyType/Infrastructure/Mongoose/Repositories'
import CropMigratedMemberRepository from 'App/Core/CropMigratedMember/Infraestructure/Mongoose/Repositories'

export default class CropAddUserKAMOfListDataSet extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'crops:add:user:kam:of:list:data:set'

  /**
   * Command description is displayed in the "help" output
   */
  public static description =
    'Adds the KAM to all the crops of a producing company, if it does not exist in members.'

  private nameFileBackup: string = 'crops-add-user-kam-of-list-data-set.json'

  @flags.boolean({ alias: 'r', description: 'Rollback flag' })
  public rollbackCommand: boolean

  private cazenaveCompanyIdentifier = '30619765555'

  private selectedUserEmail: string = ''
  private companyUcropit: any = {
    name: 'UCROPIT S.A.',
    identifier: '30716983702',
    companiesList: updateUsersCazenaveWithUcropit
  }
  private companiesUcropit = [
    {
      name: 'UCROPIT S.A.',
      identifier: '30716983702',
      companiesList: updateUsersCazenaveWithUcropit
    },
    {
      name: 'Garamendy S.A.',
      identifier: '801174732',
      companiesList: updateGaramendyProducers
    },
    {
      name: 'NONE',
      identifier: null,
      companiesList: []
    }
  ]

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
  private processingProgressBar(
    index: number,
    limit: number,
    label?: string
  ): number {
    if (index < limit) {
      index++
      const currentPercentage = Number(((index * 100) / limit).toFixed(2))
      this.logger.logUpdate(
        `${label ? '[' + label + ']' : ''} Processing: ${this.getProgressBar(
          currentPercentage
        )} ${currentPercentage}% | ${index}/${limit}`
      )
    }
    return index
  }

  public async run() {
    this.logger.info('Started adding users in companies.')
    const selectedCompanyUcropit = await this.prompt.choice(
      'Select company ucropit',
      this.companiesUcropit.map((item) => item.name)
    )

    if (selectedCompanyUcropit === 'NONE') {
      await this.exit()
    }
    this.setCompanyUcropit(selectedCompanyUcropit)

    this.selectedUserEmail = await this.prompt.choice(
      'Select the user to add companies to advice',
      this.getEmails()
    )

    if (this.selectedUserEmail === 'NONE') {
      await this.exit()
    }
    try {
      if (this.rollbackCommand) {
        this.logger.success('Started rollback companies')
        await this.rollback()
      } else {
        await this.execute()
      }
    } catch (error) {
      this.logger.error(`Error Message: ${error.message}`)
      this.logger.error(`Error: ${error}`)
    }
    this.logger.logUpdatePersist()
    this.logger.success('Add user in companies finished.')
  }

  public async rollback(): Promise<void> {
    try {
      let i: number = 0

      const user = await UserRepository.findOne({
        email: this.selectedUserEmail
      })

      if (!user) {
        this.logger.info(
          `The user with email <${this.selectedUserEmail}>is not registered in the database`
        )
        await this.exit()
      }

      let data = await StorageService.get(this.nameFileBackup)
      const crops = data[user._id].crops
      for (const item of crops) {
        i = this.processingProgressBar(i, crops.length)
        await CropRepository.updateOne(
          { _id: item.cropId },
          { $set: item.toSetData }
        )
      }
    } catch (err) {
      this.logger.error(err)
      this.exit()
    }
  }

  public setCompanyUcropit(selectedCompanyUcropit) {
    this.companyUcropit = this.companiesUcropit.find(
      (item) => item.name === selectedCompanyUcropit
    )
  }

  public getEmails(): string[] {
    const usersEmail = this.companyUcropit?.companiesList
      .map((item) => item.email.trim())
      .reduce(
        (prevList, current) =>
          // @ts-ignore
          prevList.includes(current) ? prevList : [...prevList, current],
        []
      )
      .sort()
    usersEmail.push('NONE')
    return usersEmail
  }

  public async execute(): Promise<void> {
    let i: number = 0
    const currentDate = new Date()

    const user = await UserRepository.findOne({
      email: this.selectedUserEmail
    })

    if (!user) {
      this.logger.info(
        `The user with email <${this.selectedUserEmail}>is not registered in the database`
      )
      await this.exit()
    }

    const ucropitCompany = await CompanyRepository.findOne({
      identifier: this.companyUcropit.identifier
    })

    if (!ucropitCompany) {
      this.logger.info(
        `The ucropit company identifier: ${this.companyUcropit.identifier} dont exist`
      )
      await this.exit()
    }

    const kamRole = await RolRepository.findOne({ value: ERoles.KAM })

    if (!kamRole) {
      this.logger.info('The kam role is not registered in the database')
      await this.exit()
    }

    const adviserRole = await RolRepository.findOne({ value: ERoles.ADVISER })

    if (!adviserRole) {
      this.logger.info('The adviser role is not registered in the database')
      await this.exit()
    }

    const { users: companyUsers = [] } = ucropitCompany

    // verificar si el usuario pertenece a la empresa ucropit
    const userAlreadyBelongToCompany = companyUsers?.find(
      (collaborator) => String(collaborator.user) === String(user._id)
    )

    if (!userAlreadyBelongToCompany) {
      const userToAdd = {
        isAdmin: false,
        isResponsible: false,
        user: user._id,
        role: adviserRole._id,
        company: ucropitCompany._id
      }
      await CompanyRepository.findOneAndUpdate(
        { _id: ucropitCompany._id },
        {
          $push: { users: userToAdd },
          $pull: { collaborators: { user: user._id } }
        }
      )
    }

    await this.updateRelationshipWithCompany(user, ucropitCompany)

    const fileExists = await StorageService.fileExists(this.nameFileBackup)
    if (!fileExists) {
      await StorageService.create(
        {
          [user._id]: {
            crops: []
          }
        },
        this.nameFileBackup
      )
    }

    let companyType = await CompanyTypeRepository.findOne({
      name: CompanyTypeEnum.PRODUCER
    })

    // @ts-ignore
    const companyList = this.companyUcropit.companiesList
      .filter(
        (companyProducer) =>
          companyProducer.email.trim() === this.selectedUserEmail
      )
      .map((item) => item.identifier)
    const cropsToRollback: any[] = []
    const companiesWithError: any[] = []

    let company
    const query = {
      identifier: { $in: companyList },
      'types.0': companyType?._id
    }

    const countCompanies = await CompanyRepository.count(query)
    const cursor = await CompanyRepository.findByCursor(query)
    while ((company = await cursor.next())) {
      i = this.processingProgressBar(i, countCompanies, 'companies')
      console.log('\n')
      let j = 0
      let crop
      const query = {
        identifier: company.identifier
      }

      const countCrops = await CropRepository.count(query)

      if (!countCrops) {
        companiesWithError.push({
          // @ts-ignore
          identifier: company.identifier,
          // @ts-ignore
          message: 'Company not have crops'
        })
        continue
      }

      const cursor = await CropRepository.findByCursor(query)

      while ((crop = await cursor.next())) {
        j = this.processingProgressBar(
          j,
          countCrops,
          `Company: ${company.identifier} > crops > ${crop._id}`
        )
        cropsToRollback.push({
          cropId: crop._id,
          toSetData: {
            members: crop.members
          }
        })
        await StorageService.add(
          {
            [user._id]: {
              crops: cropsToRollback
            }
          },
          this.nameFileBackup
        )

        const memberCazenaveExists = crop.members.filter(
          (member) =>
            String(member.user) === String(user._id) &&
            member.identifier === this.cazenaveCompanyIdentifier &&
            member.type.toLowerCase() === ERoles.KAM.toLowerCase()
        )

        const memberUcropitExists = crop.members.filter(
          (member) =>
            member.identifier === ucropitCompany.identifier &&
            String(member.user) === String(user._id)
        )

        const members = crop.members
          .filter(
            (item) =>
              !memberCazenaveExists.some(
                (element) => String(element._id) === String(item._id)
              )
          )
          .filter(
            (item) =>
              !memberUcropitExists.some(
                (element) => String(element._id) === String(item._id)
              )
          )

        const query = {
          _id: crop._id
        }

        members.push({
          user: user._id,
          type: kamRole.value,
          identifier: ucropitCompany.identifier,
          producer: false
        })

        const toDataSet: any = {
          $set: {
            members
          }
        }

        CropRepository.updateOne(query, toDataSet).catch(console.log)

        if (memberCazenaveExists.length) {
          this.createCropMigratedMember(crop, memberCazenaveExists[0]).catch(
            console.log
          )
        }
      }
    }

    if (companiesWithError.length) {
      const results = {
        user: this.selectedUserEmail,
        companiesWithError
      }

      try {
        const response = await AwsS3Service.upload(
          `results-commands/companies-add-users-${currentDate.getTime()}.json`,
          Buffer.from(JSON.stringify(results, null, 2)),
          'application/json',
          '',
          'public-read'
        )
        this.logger.info(
          `companies with error detail url: ${response.Location}`
        )
      } catch (e) {
        console.log(inspect(results, { depth: null }))
      }
    }
  }

  private async createCropMigratedMember(crop, member) {
    const dataToSet = {
      crop: crop._id,
      user: member.user,
      roleType: member.type,
      identifier: member.identifier
    }
    const cropMigratedMember = await CropMigratedMemberRepository.findOne(
      dataToSet
    )
    if (!cropMigratedMember) {
      CropMigratedMemberRepository.create(dataToSet).catch(console.log)
    }
  }

  private async updateRelationshipWithCompany(user, company) {
    const { _id: userId, companies = [] } = user
    const hasRelationshipWithCompany = companies.some(
      (item) => String(item.company) === String(company._id)
    )
    if (!hasRelationshipWithCompany) {
      UserRepository.findOneAndUpdate(
        { _id: userId },
        {
          $addToSet: {
            companies: {
              isAdmin: false,
              identifier: company.identifier,
              company: company._id
            }
          }
        }
      ).catch(console.log)
    }
  }
}
