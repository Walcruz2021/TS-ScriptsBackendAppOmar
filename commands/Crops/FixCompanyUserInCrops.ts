import { BaseCommand, flags } from '@adonisjs/core/build/standalone'
import CompanyRepository from 'App/Core/Company/Infrastructure/Mongoose/Repositories'
import UserRepository from 'App/Core/User/Infrastructure/Mongoose/Repositories'
import StorageService from 'App/Core/Storage/Services/StorageService'
import RolRepository from 'App/Core/Rol/Infrastructure/Mongoose/Repositories'
import { EMAIL_PATTERN, validateRegexp } from 'App/utils'
import CropRepository from 'App/Core/Crop/Infrastructure/Mongoose/Repositories'
import UserConfigRepository from 'App/Core/UserConfig/Infrastructure/Mongoose/Repositories'
import { ERoles } from 'App/Core/Rol/Infrastructure/Interfaces'

export default class FixCompanyUserInCrops extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'fix:company:user:in:crops'

  /**
   * Command description is displayed in the "help" output
   */
  public static description =
    'Updating relationship between user and companies with their crops'

  private nameFileBackup: string = 'fix-company-user-in-crops.json'

  @flags.boolean({ alias: 'r', description: 'Rollback flag' })
  public rollbackCommand: boolean

  private roleOptions = [
    'KAM',
    'PRODUCER',
    'PRODUCER_ADVISER',
    // 'PRODUCER_ADVISER_ENCOURAGED',
    'VERIFIER'
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
    this.logger.info('Started update relationship company user in crops.')
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
    this.logger.success('Update relationship company user in crops finished.')
  }

  public async rollback(): Promise<void> {
    try {
      let i: number = 0
      let data = await StorageService.get(this.nameFileBackup)
      for (const item of data) {
        i = this.processingProgressBar(i, data.length)
        const { user, company, userConfig, crop } = item
        if (user) {
          await UserRepository.findOneAndUpdate(
            { _id: user?._id },
            {
              $set: {
                companies: user?.companies ?? []
              }
            }
          )
        }
        if (company) {
          await CompanyRepository.updateOne(
            { _id: company?._id },
            {
              $set: {
                users: company?.users ?? [],
                collaborators: company?.collaborators ?? []
              }
            }
          )
        }
        if (userConfig) {
          await UserConfigRepository.findOneAndUpdate(
            { _id: userConfig._id },
            {
              $set: {
                companySelected: userConfig.companySelected,
                roleSelected: userConfig.roleSelected,
                isAdmin: userConfig.isAdmin,
                isResponsible: userConfig.isResponsible
              }
            }
          )
        }
        if (crop) {
          await CropRepository.updateOne(
            { _id: crop?._id },
            {
              $set: {
                members: crop?.members ?? []
              }
            }
          )
        }
      }
    } catch (err) {
      this.logger.error(err)
      await this.exit()
    }
  }

  public async execute(): Promise<void> {
    let i: number = 0
    let isAdmin = false
    let isResponsible = false
    let currentIdentifier

    const selectedUserEmail = await this.prompt.ask('Enter the email of user', {
      validate: this.validateEmail
    })

    const identifierToAssociate = await this.prompt.ask(
      'Enter identifier you want to associate',
      {
        validate: this.validateIdentifier
      }
    )

    const isAbsoluteIdentifier = await this.prompt.toggle(
      'You want to update the user in members with a unique identifier?',
      ['Yes', 'Not']
    )
    if (!isAbsoluteIdentifier) {
      this.logger.info(
        `Only the position of the members array where the user and the identifier match will be updated`
      )
      currentIdentifier = await this.prompt.ask(
        'Enter current identifier that you want to disassociate',
        {
          validate: this.validateIdentifier
        }
      )
    }
    const roleSelected = await this.prompt.choice(
      'Select role an associate in crop',
      this.roleOptions
    )

    if (roleSelected === 'PRODUCER') {
      isAdmin = await this.prompt.toggle('He is an admin producer?', [
        'Yes',
        'Not'
      ])
    }
    if (roleSelected === 'KAM') {
      isResponsible = await this.prompt.toggle('He is a responsible adviser?', [
        'Yes',
        'Not'
      ])
    }
    const removeRelationshipWithCurrentCompany = await this.prompt.toggle(
      'Remove relationship with current company?',
      ['Yes', 'Not']
    )
    const allCrops = await this.prompt.toggle('Update all crops?', [
      'Yes',
      'Not'
    ])
    let next = await this.prompt.toggle('Do you wish to continue?', [
      'Yes',
      'Not'
    ])
    if (!next) {
      await this.exit()
    }

    const user = await UserRepository.findOne({
      email: selectedUserEmail
    })

    if (!user) {
      this.logger.info(
        `The user with email <${selectedUserEmail}>is not registered in the database`
      )
      await this.exit()
    }

    let currentCompany
    if (currentIdentifier) {
      currentCompany = await CompanyRepository.findOne({
        identifier: currentIdentifier
      })

      if (!currentCompany) {
        this.logger.info(
          `The current company with identifier: ${currentIdentifier} dont exist`
        )
        next = await this.prompt.toggle('Do you wish to continue?', [
          'Yes',
          'Not'
        ])
        if (!next) {
          await this.exit()
        }
      }
    }

    const companyToAssociate = await CompanyRepository.findOne({
      identifier: identifierToAssociate
    })

    if (!companyToAssociate) {
      this.logger.info(
        `The company with identifier: ${identifierToAssociate} dont exist`
      )
      await this.exit()
    }

    const equivalentRole = await RolRepository.findOne({
      equivalentRole: roleSelected
    })

    await StorageService.create([], this.nameFileBackup)

    await StorageService.add(
      {
        user
      },
      this.nameFileBackup
    )

    if (currentCompany) {
      await StorageService.add(
        {
          company: currentCompany
        },
        this.nameFileBackup
      )
    }

    await StorageService.add(
      {
        company: companyToAssociate
      },
      this.nameFileBackup
    )

    await this.updateRelationshipWithCompany(
      user,
      companyToAssociate,
      isAdmin,
      isResponsible,
      equivalentRole
    )

    if (removeRelationshipWithCurrentCompany) {
      await this.removeRelationshipWithCurrentCompany(
        user,
        currentCompany,
        companyToAssociate,
        equivalentRole,
        isAdmin,
        isResponsible,
        currentIdentifier
      )
    }

    let crop
    let query = {
      identifier: identifierToAssociate
    }
    let queryMembers = {
      members: {
        $elemMatch: { user: user._id }
      }
    }

    if (currentIdentifier) {
      queryMembers = {
        members: {
          // @ts-ignore
          $elemMatch: { user: user._id, identifier: currentIdentifier }
        }
      }
    }

    if (!allCrops) {
      query = {
        ...query,
        ...queryMembers
      }
    }

    const countCrops = await CropRepository.count(query)
    if (!countCrops) {
      this.logger.info(`Company ${companyToAssociate.name} not have crops`)
      await this.exit()
    }

    const cursor = await CropRepository.findByCursor(query)
    while ((crop = await cursor.next())) {
      i = this.processingProgressBar(i, countCrops)

      await StorageService.add(
        {
          crop
        },
        this.nameFileBackup
      )

      if (currentIdentifier) {
        crop.members = crop.members.filter(
          (member) =>
            String(member.user) !== String(user._id) &&
            [currentIdentifier, identifierToAssociate].includes(
              member.identifier
            )
        )
      } else {
        crop.members = crop.members.filter(
          (member) => String(member.user) !== String(user._id)
        )
      }

      crop.members.push({
        user: user._id,
        type: roleSelected,
        identifier: companyToAssociate.identifier,
        producer: roleSelected === ERoles.PRODUCER,
        country: crop?.country
      })

      await crop.save()
    }
  }

  private async updateRelationshipWithCompany(
    user,
    company,
    isAdmin,
    isResponsible,
    equivalentRole
  ) {
    const { _id: userId, companies = [] } = user
    const { users: companyUsers = [] } = company

    const relationshipWithCompany = companies.find(
      (item) => String(item.company) === String(company._id)
    )
    if (relationshipWithCompany) {
      await UserRepository.findOneAndUpdate(
        { 'companies._id': relationshipWithCompany._id },
        {
          $set: {
            'companies.$.isAdmin': isAdmin,
            'companies.$.identifier': company.identifier
          }
        }
      )
    } else {
      UserRepository.findOneAndUpdate(
        { _id: userId },
        {
          $addToSet: {
            companies: {
              isAdmin,
              identifier: company.identifier,
              company: company._id
            }
          }
        }
      ).catch(console.log)
    }

    if (!equivalentRole) {
      return null
    }

    const userAlreadyBelongToCompany = companyUsers?.find(
      (collaborator) => String(collaborator.user) === String(user._id)
    )

    if (userAlreadyBelongToCompany) {
      await CompanyRepository.findOneAndUpdate(
        { 'users._id': userAlreadyBelongToCompany._id },
        {
          $set: {
            'users.$.role': equivalentRole._id,
            'users.$.isAdmin': isAdmin,
            'users.$.isResponsible': isResponsible
          }
        }
      )
      await CompanyRepository.findOneAndUpdate(
        { _id: company._id },
        {
          $pull: { collaborators: { user: user._id } }
        }
      )
    } else {
      const userToAdd = {
        isAdmin,
        isResponsible,
        user: user._id,
        role: equivalentRole._id,
        company: company._id
      }
      await CompanyRepository.findOneAndUpdate(
        { _id: company._id },
        {
          $push: { users: userToAdd },
          $pull: { collaborators: { user: user._id } }
        }
      )
    }
  }

  private async removeRelationshipWithCurrentCompany(
    user,
    currentCompany,
    companyToAssociate,
    equivalentRole,
    isAdmin,
    isResponsible,
    currentIdentifier
  ) {
    await UserRepository.findOneAndUpdate(
      { _id: user._id },
      {
        $pull: { companies: { identifier: currentIdentifier } }
      }
    )
    if (!currentCompany) {
      return null
    }

    await CompanyRepository.findOneAndUpdate(
      { _id: currentCompany._id },
      {
        $pull: {
          users: { user: user._id },
          collaborators: { user: user._id }
        }
      }
    )

    const userConfig = await UserConfigRepository.findOne({ _id: user.config })
    if (String(userConfig?.companySelected) === String(currentCompany?._id)) {
      await StorageService.add(
        {
          userConfig
        },
        this.nameFileBackup
      )
      await UserConfigRepository.findOneAndUpdate(
        { _id: user.config },
        {
          $set: {
            companySelected: companyToAssociate._id,
            roleSelected: equivalentRole?._id ?? null,
            isAdmin,
            isResponsible
          }
        }
      )
    }
  }

  private async validateEmail(email: string): Promise<string | boolean> {
    if (!email) {
      return 'Enter email'
    }
    if (!validateRegexp(email, EMAIL_PATTERN)) {
      return 'Invalid email'
    }

    return true
  }
  private async validateIdentifier(
    identifier: string
  ): Promise<string | boolean> {
    if (!identifier) {
      return 'Enter identifier or taxId'
    }
    return true
  }
}
