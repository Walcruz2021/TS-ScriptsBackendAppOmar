import { existsSync, mkdirSync } from 'fs'
import { string } from '@ioc:Adonis/Core/Helpers'
import { BaseCommand, flags } from '@adonisjs/core/build/standalone'

import StorageRepository from 'App/Core/Storage'
import CompanyTypeRepository from 'App/Core/CompanyType/Infrastructure/Mongoose/Repositories'
import CountryRepository from 'App/Core/Country/Infraestructure/Mongoose/Repositories'
import UserRepository from 'App/Core/User/Infrastructure/Mongoose/Repositories'
import CompanyRepository from 'App/Core/Company/Infrastructure/Mongoose/Repositories'
import UserConfigRepository from 'App/Core/UserConfig/Infrastructure/Mongoose/Repositories'
import FileDocumentRepository from 'App/Core/FileDocument/Infrastructure/Mongoose/Repositories'
import { CompanyEnum } from 'App/Core/Company/enums/Company.enum'
import { UserContactEnum } from 'App/Core/User/enums/Company.enum'
import {
  EMAIL_PATTERN,
  OBJECT_ID_PATTERN,
  validateInput,
  validateRegexp,
  validateSelectMultiple
} from 'App/utils'
import { CompanyDocument } from 'App/Core/Company/Infrastructure/Mongoose/Interfaces'
import { UserDocument } from 'App/Core/User/Infrastructure/Mongoose/Interfaces'
import { UserConfigDocument } from 'App/Core/UserConfig/Infrastructure/Mongoose/Interfaces'
import { CountryDocument } from 'App/Core/Country/Infraestructure/Mongoose/Interfaces'

export default class CompanyCreate extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'company:create'

  /**
   * Command description is displayed in the "help" output
   */
  public static description =
    'This command allows you to create a company with your administrator user'

  @flags.boolean({ alias: 'r', description: 'Rollback flag' })
  public rollbackCommand: boolean

  private nameFileBackup: string = 'company-create.json'

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
   * @returns
   */
  private processingProgressBar(index: number, limit: number): number {
    if (index < limit) {
      index++
      const currentPercentage = Number(((index * 100) / limit).toFixed(2))
      this.logger.logUpdate(
        `Processing: ${this.getProgressBar(
          currentPercentage
        )} ${currentPercentage}%`
      )
    }
    return index
  }

  /**
   * Execute method command.
   */
  private async execute(): Promise<void> {
    try {
      const typePersons = Object.keys(CompanyEnum).map((name) => {
        return {
          name,
          message: string.sentenceCase(name)
        }
      })

      const companyTypes = await CompanyTypeRepository.findAll({})
      const companyTypesEnum = companyTypes.map((companyType) => {
        return {
          name: companyType.name,
          message: string.sentenceCase(companyType.name)
        }
      })
      const countries = await CountryRepository.findAll({ disabled: false })
      const countriesEnum = countries.map((country) => {
        return {
          name: country.alpha3Code,
          message: string.sentenceCase(country.name)
        }
      })

      const email = await this.prompt.ask(
        'Enter the email of the company administrator user',
        {
          validate: this.validateEmail
        }
      )
      const identifier = await this.prompt.ask('Enter identifier or taxId', {
        validate: this.validateIdentifier
      })
      const typePerson = await this.prompt.choice(
        'Select type person',
        typePersons
      )
      const types = await this.prompt.multiple(
        'Select type company',
        companyTypesEnum,
        {
          validate: validateSelectMultiple,
          result: (values) => this.getResults(values, 'name', companyTypes)
        }
      )
      const name = await this.prompt.ask('Enter company name', {
        validate: validateInput
      })
      const address = await this.prompt.ask('Enter address', {
        validate: validateInput
      })
      const addressFloor = await this.prompt.ask(
        'Enter addressFloor (Optional)'
      )
      const country = await this.prompt.choice(
        'Select country',
        countriesEnum,
        {
          result: (value) => this.getResult(value, 'alpha3Code', countries)
        }
      )

      const files = await this.uploadFiles()

      const companyDTO = {
        identifier,
        typePerson,
        name,
        address,
        addressFloor,
        types: types.map((item) => item._id.toString()),
        country: country._id.toString(),
        files
      }
      const storageBackup: Record<string, string>[] = []
      const companyDocument = await this.createCompany(companyDTO)
      storageBackup.push({
        _id: String(companyDocument._id),
        model: 'COMPANY'
      })
      const userConfigDocument = await this.createUserConfig(
        companyDocument,
        country
      )
      storageBackup.push({
        _id: String(userConfigDocument._id),
        model: 'USER_CONFIG'
      })
      const userDocument = await this.createUser(
        email,
        companyDocument,
        userConfigDocument
      )
      storageBackup.push({
        _id: String(userDocument._id),
        model: 'USER'
      })
      files.forEach((id) => {
        storageBackup.push({
          _id: String(id),
          model: 'FILE'
        })
      })

      await this.updateCompanyWithContact(companyDocument, userDocument)
      await StorageRepository.create(storageBackup, this.nameFileBackup)
      this.logger.info(`Company created: ${String(companyDocument._id)}`)
      this.logger.info(`User created: ${String(userDocument._id)}`)
      this.logger.info(`UserConfig created: ${String(userConfigDocument._id)}`)
    } catch (err) {
      this.logger.error(err.toString())
    }
  }

  /**
   * Rollback command
   */
  private async rollback(): Promise<void> {
    let i: number = 0
    const data = await StorageRepository.get(this.nameFileBackup)
    for (const item of data) {
      const query = {
        _id: item._id
      }
      switch (item.model) {
        case 'USER_CONFIG':
          await UserConfigRepository.deleteOne(query)
          break
        case 'USER':
          await UserRepository.deleteOne(query)
          break
        case 'COMPANY':
          await CompanyRepository.deleteOne(query)
          break
        case 'FILE':
          await FileDocumentRepository.deleteOne(query)
          break
      }
      i = this.processingProgressBar(i, data.length)
    }
  }

  /**
   * Run command.
   */
  public async run() {
    this.validateDirTmp()
    this.logger.success('Started Create Company')
    try {
      if (this.rollbackCommand) {
        await this.rollback()
      } else {
        await this.execute()
      }
    } catch (error) {
      this.logger.error(`Error Message: ${error.message}`)
      this.logger.error(`Error: ${error}`)
    }
    this.logger.logUpdatePersist()
    this.logger.success('Create Company Success')
  }

  /**
   * @function createCompany
   * @description Create a new company
   * @param companyDTO Payload of the data to create the company
   * @return Promise<CompanyDocument>
   * */

  private async createCompany(companyDTO): Promise<CompanyDocument> {
    return await CompanyRepository.create(companyDTO)
  }

  /**
   * @function createUserConfig
   * @description Create user settings for a specific company
   * @param company Instance of a CompanyDocument
   * @param country Instance of a CountryDocument
   * @return Promise<UserConfigDocument>
   * */
  private async createUserConfig(
    company: CompanyDocument,
    country: CountryDocument
  ): Promise<UserConfigDocument> {
    const { _id: companyId } = company
    const { languages } = country
    const userConfigDTO = {
      fromInvitation: true,
      companySelected: companyId,
      languageSelected: languages[0].iso639_1
    }
    return await UserConfigRepository.create(userConfigDTO)
  }

  /**
   * @function createUser
   * @description Create the administrator user of a company
   * @param email Payload of the data to create the company
   * @param company Instance of a CompanyDocument
   * @param userConfig Instance of a UserConfigDocument
   * @return Promise<UserDocument>
   * */
  private async createUser(
    email: string,
    company: CompanyDocument,
    userConfig: UserConfigDocument
  ): Promise<UserDocument> {
    const { _id: companyId, identifier } = company
    const { _id: configId } = userConfig
    const userDTO = {
      email,
      companies: [
        {
          company: String(companyId),
          isAdmin: true,
          identifier
        }
      ],
      config: configId
    }

    return await UserRepository.create(userDTO)
  }

  /**
   * @function updateCompanyWithContact
   * @description Add the user as a contact to a company
   * @param company Instance of a CompanyDocument
   * @param user Instance of a UserDocument
   * @return Promise<any>
   * */
  private async updateCompanyWithContact(
    company: CompanyDocument,
    user: UserDocument
  ): Promise<any> {
    const query = {
      _id: String(company._id)
    }
    const contact = {
      type: UserContactEnum.CONTACT_REPRESENTATIVE,
      user: String(user._id)
    }
    const data = {
      $set: { contacts: [contact] }
    }
    return await CompanyRepository.updateOne(query, data)
  }

  /**
   * @function uploadFiles
   * @description Intera loading of various company documents
   * @return Array
   * */
  private async uploadFiles(): Promise<string[]> {
    let next = true
    let files: string[] = []
    await this.prompt.toggle(
      `For the next step, go to MS Files. Confirm if it is located in the MS Files?`,
      ['Yes', 'Not'],
      {
        validate: (value) => {
          if (!value) {
            return `Go to MS Files.`
          }
          return true
        }
      }
    )
    while (next) {
      const name = await this.prompt.ask('Enter file name', {
        validate: validateInput
      })
      const description = await this.prompt.ask('Enter file description', {
        validate: validateInput
      })
      const fileId = await this.prompt.ask(
        'Enter the id you got from the MS file when loading the document',
        {
          validate: async (value) => await this.validateFile(value, files)
        }
      )
      const dataToUpdate = {
        name,
        description
      }
      await FileDocumentRepository.updateOne(
        { _id: fileId },
        { $set: dataToUpdate }
      )
      files.push(fileId)
      next = await this.prompt.toggle('You want to upload another document?', [
        'Yes',
        'Not'
      ])
    }

    return files
  }

  /**
   * @function validateIdentifier
   * @description Validate if the identifier has already been assigned to a company
   * @param identifier Unique identifier or taxId of the company
   * @return String || Boolean
   * */

  private async validateIdentifier(
    identifier: string
  ): Promise<string | boolean> {
    if (!identifier) {
      return 'Enter identifier or taxId'
    }
    const company = await CompanyRepository.findOne({ identifier })
    if (company) {
      return 'There is a company with the same identifier'
    }
    return true
  }

  /**
   * @function validateEmail
   * @description Validate if the email is in use
   * @param email User email
   * @return String || Boolean
   * */

  private async validateEmail(email: string): Promise<string | boolean> {
    if (!email) {
      return 'Enter email'
    }
    if (!validateRegexp(email, EMAIL_PATTERN)) {
      return 'Invalid email'
    }

    const user = await UserRepository.findOne({ email })
    if (user) {
      return 'There is a user with the same email'
    }
    return true
  }

  /**
   * @function validateFiles
   * @description Validate if the id document
   * @param value Document id
   * @return String || Boolean
   * */

  private async validateFile(value: string, files): Promise<string | boolean> {
    if (!value) {
      return 'Invalid document id'
    }

    if (!validateRegexp(value, OBJECT_ID_PATTERN)) {
      return `Invalid ObjectId ${value}`
    }

    const query = {
      _id: value
    }
    const file = await FileDocumentRepository.findOne(query)
    if (!file) {
      return 'No document found'
    }

    const fileExists = files.find((item) => String(item) === String(value))
    if (fileExists) {
      return `this document id: ${value} has already been added. Files: [${files.join()}]`
    }

    return true
  }
  /**
   * @function getResults
   * @description Allows you to go through a list of results to obtain an associated document
   * @param values Selected results
   * @param key Key of the field to be captured from a document list
   * @param elements List of documents from which you can choose the results
   * @return String || Boolean
   * */

  private getResults(values, key, elements) {
    return values.map((value) => this.getResult(value, key, elements))
  }

  /**
   * @function getResult
   * @description Allows you to go through a list of results to obtain an associated document
   * @param value Selected result
   * @param key Key of the field to be captured from a document list
   * @param elements List of documents from which you can choose the results
   * @return String || Boolean
   * */

  private getResult(value, key, elements) {
    const result = elements.find((item) => item[key] === value)
    return result ?? null
  }
  /**
   * @function validateDirTmp
   * @description Validate if the tmp directory exists
   * */

  private validateDirTmp() {
    const tmp = `${process.cwd()}/tmp`
    if (!existsSync(tmp)) {
      mkdirSync(tmp)
    }
  }
}
