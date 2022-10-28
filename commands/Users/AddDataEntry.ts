import { BaseCommand, flags } from '@adonisjs/core/build/standalone'
import StorageRepository from 'App/Core/Storage'
import Aws from '@ioc:Aws'
import Env from '@ioc:Adonis/Core/Env'
import { createEventAuditUseCase } from 'App/Core/EventsAuditEntities/Infrastructure/useCase'
import {
  EOperationTypeDataBase,
  IEntity
} from 'App/Core/EventsAuditEntities/Infrastructure/Mongoose/Interfaces/EventsAuditEntities.interface'
import UserRepository from 'App/Core/User/Infrastructure/Mongoose/Repositories'
import CompanyRepository from 'App/Core/Company/Infrastructure/Mongoose/Repositories'
import RolRepository from 'App/Core/Rol/Infrastructure/Mongoose/Repositories'
import { UserConfigDocument } from 'App/Core/UserConfig/Infrastructure/Mongoose/Interfaces'
import UserConfigRepository from 'App/Core/UserConfig/Infrastructure/Mongoose/Repositories'
import { UserDocument } from 'App/Core/User/Infrastructure/Mongoose/Interfaces'
import { CompanyDocument } from 'App/Core/Company/Infrastructure/Mongoose/Interfaces'
import axios from 'axios'

export default class AddDataEntry extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'add:data:entry'
  /**
   * Command description is displayed in the "help" output
   */
  public static description = 'This command add data entry'

  private nameFileBackup: string = 'add-data-entry.json'

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

  public async run() {
    this.logger.success('Started add data entry')
    try {
      if (this.rollbackCommand) {
        this.logger.success('Started rollback add data entry')
        await this.rollback()
      } else {
        await this.execute()
      }
    } catch (error) {
      this.logger.error(`Error Message: ${error.message}`)
      this.logger.error(`Error: ${error}`)
    }
    this.logger.logUpdatePersist()
    this.logger.success('Add data entry Success')
  }

  public async execute(): Promise<void> {
    let ucropitCompanyIdentifier = '30716983702'
    let i: number = 0
    let listBackup: Array<Object> = []
    let addDataEntry = await this.getPromptS3()

    let company: CompanyDocument = await CompanyRepository.findOne({
      identifier: ucropitCompanyIdentifier
    })
    for (const item of addDataEntry) {
      let role = await RolRepository.findOne({ value: item.role })
      let user = await UserRepository.findOne({ email: item.email })

      if (user) {
        let companyUser = await CompanyRepository.findOne({
          'users.user': user._id,
          identifier: ucropitCompanyIdentifier
        })

        if (companyUser) {
          const dataBackup = {
            companyId: company._id,
            type: 'updateCompany',
            data: company
          }
          listBackup.push(dataBackup)

          await CompanyRepository.findOneAndUpdate(
            {
              _id: company._id,
              'users.user': user._id
            },
            {
              $set: {
                ['users.$.isDataEntry']: item.isDataEntry
              }
            }
          )
          await createEventAuditUseCase.execute(
            company._id,
            IEntity.COMPANY,
            EOperationTypeDataBase.UPDATE
          )
        } else {
          const dataBackup = {
            companyId: company._id,
            type: 'updateCompany',
            data: company
          }
          listBackup.push(dataBackup)
          let dtoCompanyUsers = {
            isDataEntry: item.isDataEntry,
            user: user._id,
            role: role._id
          }

          await CompanyRepository.findOneAndUpdate(
            { _id: company._id },
            { $push: { users: dtoCompanyUsers } }
          )
          await createEventAuditUseCase.execute(
            company._id,
            IEntity.COMPANY,
            EOperationTypeDataBase.UPDATE
          )
        }
      } else {
        let userConfig = await this.createUserConfig(company._id)
        let user = await this.createUser(
          item.email,
          item.firstName,
          item.lastname,
          company,
          userConfig
        )
        const dataBackup = {
          companyId: company._id,
          companyData: company,
          userConfigId: userConfig._id,
          type: 'createUser',
          userId: user._id
        }
        listBackup.push(dataBackup)
        let dtoCompanyUsers = {
          isDataEntry: item.isDataEntry,
          user: user._id,
          role: role._id
        }

        await CompanyRepository.findOneAndUpdate(
          { _id: company._id },
          { $push: { users: dtoCompanyUsers } }
        )

        await createEventAuditUseCase.execute(
          user._id,
          IEntity.USER,
          EOperationTypeDataBase.CREATE
        )

        await createEventAuditUseCase.execute(
          userConfig._id,
          IEntity.USERCONFIG,
          EOperationTypeDataBase.CREATE
        )

        await createEventAuditUseCase.execute(
          company._id,
          IEntity.COMPANY,
          EOperationTypeDataBase.UPDATE
        )
      }

      i = this.processingProgressBar(i, addDataEntry.length)
    }

    await StorageRepository.create(listBackup, this.nameFileBackup)
  }

  /**
   * Rollback Command
   */
  public async rollback(): Promise<void> {
    let i: number = 0
    const data = await StorageRepository.get(this.nameFileBackup)

    for (const item of data) {
      switch (item.type) {
        case 'updateCompany':
          await CompanyRepository.update(
            { _id: item.companyId },
            { $set: item.data }
          )
          break
        case 'createUser':
          await CompanyRepository.update(
            { _id: item.companyId },
            { $set: item.companyData }
          )
          await UserRepository.deleteOne({ _id: item.userId })
          await UserConfigRepository.deleteOne({ _id: item.userConfigId })
          break
      }

      i = this.processingProgressBar(i, data.length)
    }

    await StorageRepository.delete(this.nameFileBackup)
  }

  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  async getFile(bucket: string, key: string): Promise<any> {
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

  /**
   * @function validate
   * @description Validate if data is not empty
   * @param data
   * @return String || Boolean
   * */

  private async validate(data: string): Promise<string | boolean> {
    if (!data) {
      return 'Can not be empty'
    }
    return true
  }

  private async createUserConfig(
    companyId: string
  ): Promise<UserConfigDocument> {
    const userConfigDTO = {
      companySelected: companyId
    }
    return await UserConfigRepository.create(userConfigDTO)
  }

  private async createUser(
    email: string,
    firstName: string,
    lastName: string,
    company: CompanyDocument,
    userConfig: UserConfigDocument
  ): Promise<UserDocument> {
    const { _id: companyId, identifier } = company
    const { _id: configId } = userConfig
    const userDTO = {
      email,
      firstName,
      lastName,
      companies: [
        {
          company: companyId,
          identifier
        }
      ],
      config: configId
    }

    return await UserRepository.create(userDTO)
  }

  async getPromptS3() {
    const bucket = Env.get('AWS_PUBLIC_BUCKET_NAME')
    const hasUrl = await this.prompt.toggle('It has an s3 url?', ['Yes', 'Not'])
    if (hasUrl) {
      const url = await this.prompt.ask('Enter the url', {
        validate: this.validate
      })
      return await this.getFileByUrl(url)
    } else {
      const key = await this.prompt.ask('Enter the key', {
        validate: this.validate
      })
      let data = await this.getFile(bucket, key)
      return JSON.parse(data.body.toString('utf-8'))
    }
  }
  async getFileByUrl(url): Promise<any> {
    this.logger.await('Waiting for the data in S3')
    const response = await axios.get(url, { responseType: 'json' })
    return response.data
  }
}
