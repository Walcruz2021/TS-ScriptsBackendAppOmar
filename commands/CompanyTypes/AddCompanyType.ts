import { BaseCommand, flags } from '@adonisjs/core/build/standalone'
import CompanyTypeRepository from 'App/Core/CompanyType/Infrastructure/Mongoose/Repositories'
import CompanyRepository from 'App/Core/Company/Infrastructure/Mongoose/Repositories'
import StorageRepository from 'App/Core/Storage'
import Aws from '@ioc:Aws'
import Env from '@ioc:Adonis/Core/Env'
export default class AddCompanyType extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'add:company:type'

  /**
   * Command description is displayed in the "help" output
   */
  public static description = 'This command add Company type in Company'

  @flags.boolean({ alias: 'r', description: 'Rollback flag' })
  public rollbackCommand: boolean

  private nameFileBackup: string = 'add-company-type.json'

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
    this.logger.success('Started Add Company type in Company')
    try {
      if (this.rollbackCommand) {
        this.logger.success('Started rollback Add Company type in Company')
        await this.rollback()
      } else {
        await this.execute()
      }
    } catch (error) {
      this.logger.error(`Error Message: ${error.message}`)
      this.logger.error(`Error: ${error}`)
    }
    this.logger.logUpdatePersist()
    this.logger.success('Add Company type in Company Success')
  }

  public async execute(): Promise<void> {
    let i: number = 0
    let listBackup: Array<Object> = []

    const companyType = await CompanyTypeRepository.findAll({})

    const key = await this.prompt.ask('Enter the key', {
      validate: this.validate
    })

    let data = await this.getFile(Env.get('AWS_PUBLIC_BUCKET_NAME'), key)
    let addCompanyType = JSON.parse(data.body.toString('utf-8'))

    for (const company of addCompanyType) {
      let checkExistCompany: any = await CompanyRepository.findOne({
        identifier: company.identifier
      })
      let findCompanyType = companyType.find(
        (type) => type.name === company.companyType
      )

      if (checkExistCompany && findCompanyType) {
        if (checkExistCompany.types.length) {
          if (
            checkExistCompany.types[0].toString() !==
            findCompanyType._id.toString()
          ) {
            const CompanyBackup = {
              companyId: checkExistCompany._id.toString(),
              companyTypeIdPrevious: checkExistCompany.types[0].toString(),
              type: 'Modify'
            }
            listBackup.push(CompanyBackup)
            await CompanyRepository.findOneAndUpdate(
              {
                _id: checkExistCompany._id
              },
              { $set: { types: findCompanyType._id } }
            )
          }
        } else {
          const CompanyBackup = {
            companyId: checkExistCompany._id.toString(),
            companyTypeId: findCompanyType._id.toString(),
            type: 'Add'
          }
          listBackup.push(CompanyBackup)
          await CompanyRepository.findOneAndUpdate(
            {
              _id: checkExistCompany._id
            },
            { $push: { types: findCompanyType._id } }
          )
        }

        i = this.processingProgressBar(i, addCompanyType.length)
      }
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
      if (item.type === 'Add') {
        await CompanyRepository.findOneAndUpdate(
          {
            _id: item.companyId
          },
          { $pull: { types: item.companyTypeId } }
        )
      }
      if (item.type === 'Modify') {
        await CompanyRepository.findOneAndUpdate(
          {
            _id: item.companyId
          },
          { $set: { types: item.companyTypeIdPrevious } }
        )
      }

      i = this.processingProgressBar(i, data.length)
    }

    //await StorageRepository.delete(this.nameFileBackup)
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
}
