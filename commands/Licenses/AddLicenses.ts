import { BaseCommand, flags } from '@adonisjs/core/build/standalone'
import moment from 'moment'
import StorageRepository from 'App/Core/Storage'
import ClauseRepository from 'App/Core/Clauses/Infrastructure/Mongoose/Repositories'
import LicenseRepository from 'App/Core/License/Infrastructure/Mongoose/Repositories'
import CountryRepository from 'App/Core/Country/Infraestructure/Mongoose/Repositories'
import CompanyRepository from 'App/Core/Company/Infrastructure/Mongoose/Repositories'
import CropTypeRepository from 'App/Core/CropType/Infraestructure/Mongoose/Repositories'
import {
  ILicencesInExcelDTO,
  ILicenseProps
} from 'App/Core/License/Infrastructure/Mongoose/Interfaces/License.interface'
import { IVerifierCompanies } from 'App/Core/VerificationType/Infrastructure/Mongoose/Interfaces/VerificationType.interface'
import Aws from '@ioc:Aws'
import { dataJson } from '../../dataset/licenseData'
import { Types } from 'mongoose'
import { v4 as uuid } from 'uuid'
import {
  existsSyncUtil,
  generateArrayPercentage,
  generateSlug
} from 'App/utils/utils'
import { uploadImages } from 'App/utils/uploadFiles'
import { IClauseProps } from 'App/Core/Clauses/Infrastructure/Mongoose/Interfaces/Clause.interface'
import {
  createFilePrivateUseCase,
  createFileUseCase
} from 'App/Core/FileDocument/useCase'
import { CountryDocument } from 'App/Core/Country/Infraestructure/Mongoose/Interfaces'
import {
  validateClauses,
  validateIdentifiers,
  validateLicense,
  validateUsers,
  validateVerificationType,
  validateVerifierCompaniesAndUsers
} from 'App/Core/utils/LicenseValidation'
import { CreateLicenseDTO } from 'App/Core/License/Infrastructure/Mongoose/Interfaces/License.interface'
import {
  generateHashLicenses,
  generateHashSubLicenses
} from 'App/Core/utils/generateHashLicenses'
import {
  ISubLicencesInExcelDTO,
  SubLicense
} from 'App/Core/SubLicense/Infrastructure/Mongoose/Interfaces/SubLicense.interface'
import { CreateSubLicenseDTO } from 'App/Core/SubLicense/Infrastructure/Mongoose/Interfaces/SubLicense.interface'
import SubLicenseRepository from 'App/Core/SubLicense/Infrastructure/Mongoose/Repositories'
import { createSubLicenseSchema } from 'App/Core/SubLicense/CreateSubLicenseSchema'

export default class AddLicenses extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'add:licenses'

  /**
   * Command description is displayed in the "help" output
   */
  public static description = 'This command add licenses'
  private clauseFileBackup: string = 'clause.json'

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
    this.logger.success('Started add licenses')
    try {
      if (this.rollbackCommand) {
        this.logger.success('Started rollback add licenses')
        await this.rollback()
      } else {
        await this.execute()
      }
    } catch (error) {
      this.logger.error(`Error Message: ${error.message}`)
      this.logger.error(`Error: ${error}`)
    }
    this.logger.logUpdatePersist()
    this.logger.success('add licenses Success')
  }

  public async execute(): Promise<void> {
    // const bucket = await this.prompt.ask('Enter the bucket', {
    //   validate: this.validate,
    // })
    // const key = await this.prompt.ask('Enter the key', {
    //   validate: this.validate,
    // })

    // let data = await this.getFile(bucket, key)
    // let addPtActiveIngredient = JSON.parse(data.body.toString('utf-8'))

    const currentDate = new Date()
    const rawClauses: any = dataJson.clauses
      ? await this.parseKeys(dataJson.clauses)
      : []
    const rawVerifierCompanies: any = dataJson.verifierCompanies
      ? await this.parseKeys(dataJson.verifierCompanies)
      : []
    const rawLicenses: any = dataJson.licencias
      ? await this.parseKeys(dataJson.licencias)
      : []
    const rawSubLicenses: any = dataJson.sub_licencias
      ? await this.parseKeys(dataJson.sub_licencias)
      : []

    let resultsClauses: any = []
    let resultsLicenses: any = []
    let resultsSubLicenses: any = []
    let resultsVerifierCompanies: any = []

    if (rawClauses.length) {
      resultsClauses = await this.asyncLoopsChunkCreateClauses(
        rawClauses,
        rawClauses.length
      )
    }

    if (rawLicenses.length) {
      resultsLicenses = await this.asyncLoopsChunkCreateLicenses(
        rawLicenses,
        rawLicenses.length
      )
    }

    if (rawSubLicenses.length) {
      resultsSubLicenses = await this.asyncLoopsChunkCreateSubLicenses(
        rawSubLicenses,
        rawSubLicenses.length
      )
    }

    if (rawVerifierCompanies.length) {
      resultsVerifierCompanies =
        await this.asyncLoopsChunkCreateVerifierCompanies(
          rawVerifierCompanies,
          rawVerifierCompanies.length
        )
    }

    console.log('Clauses: ', rawClauses.length)
    console.log('Licenses: ', rawLicenses.length)
    console.log('SubLicenses: ', rawSubLicenses.length)
    console.log('VerifierCompanies: ', rawVerifierCompanies.length)
    const dataJSON = {
      createdAt: currentDate,
      clauses: resultsClauses,
      licenses: resultsLicenses,
      subLicenses: resultsSubLicenses,
      VerifierCompanies: resultsVerifierCompanies,
      clausesLength: resultsClauses.length,
      licensesLength: resultsLicenses.length,
      subLicensesLengtgh: resultsSubLicenses.length,
      VerifierCompaniesLength: resultsVerifierCompanies.length
    }

    const filePath = `${process.cwd()}/tmp/results_${currentDate.getTime()}.json`

    await StorageRepository.create(
      dataJSON,
      `/results_${currentDate.getTime()}.json`
    )

    const fileResponse = await createFileUseCase.execute({
      filePath,
      directory: 'licensesInLots',
      entityId: new Types.ObjectId().toHexString()
    })

    const file = fileResponse.value
    if (fileResponse.isRight()) {
      const { key, path } = file.getValue()
      console.log('key: ', key)
      console.log('url: ', path)
    }
    console.timeEnd('upload_excel')
    process.exit()
  }

  /**
   * Rollback Command
   */
  public async rollback(): Promise<void> {
    let i: number = 0
    const dataClause = await StorageRepository.get(this.clauseFileBackup)

    for (const item of dataClause) {
      await ClauseRepository.deleteOne({ _id: item._id })
      i = this.processingProgressBar(i, dataClause.length)
    }

    //await StorageRepository.delete(this.clauseFileBackup)
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

  private async parseKeys(results) {
    return results.map((item) => {
      const result = {}
      Object.keys(item).map((key) => {
        result[key.trim()] = item[key]
      })
      return result
    })
  }

  private async asyncLoopsChunkCreateClauses(
    chunks,
    lengthItems
  ): Promise<string[]> {
    let listBackup: Array<Object> = []
    return new Promise(async (resolve, reject) => {
      const resultsChunk: any = []
      const maxLen = 50
      let porcentagesArray = generateArrayPercentage('.', maxLen)

      async function helperChunk(index, cb) {
        try {
          if (index === lengthItems) {
            cb(null, resultsChunk)
            return
          }

          const count = index + 1
          const avg = (count * maxLen) / lengthItems
          const avgPorcentage = (avg / maxLen) * 100
          porcentagesArray = generateArrayPercentage(
            '#',
            avg + 1,
            porcentagesArray
          )
          console.log(
            new Date(),
            `[${porcentagesArray.join(
              ''
            )}] clause ${count}/${lengthItems} (${avgPorcentage.toFixed(1)}%)`
          )

          const row: IClauseProps = chunks[index]
          const title = row.title.trim()
          const slug = generateSlug(title)
          const imageName = row.image!.trim()
          const filePath = `${process.cwd()}/dataset/resources/clausulas_images/${imageName}`

          if (!existsSyncUtil(filePath)) {
            resultsChunk.push({
              success: false,
              title,
              error: `No pudimos encontrar la image <${imageName}> asociada a la clausula <${title}>.`
            })

            return setImmediate(helperChunk.bind(null, index + 1, cb))
          }

          let clause: any = await ClauseRepository.findOne({
            id_clause: Number(row.id_clause)
          })

          if (clause) {
            resultsChunk.push({
              success: false,
              title,
              message: `Existe una clausula: <${title}>, con el mismo id_clause: <${row.id_clause}>.`
            })

            return setImmediate(helperChunk.bind(null, index + 1, cb))
          }

          const clauseId = new Types.ObjectId()
          const { imageOriginal, imageThumbnail, imageIntermediate } =
            await uploadImages(clauseId, 'clauses', row.image, filePath)
          clause = {
            _id: clauseId,
            id: uuid(),
            title,
            slug,
            description: row.description,
            imageOriginal,
            imageThumbnail,
            imageIntermediate,
            id_clause: Number(row.id_clause)
          }

          let newClause = await ClauseRepository.create(clause)

          const clauseBackup = {
            clauseId: newClause._id
          }

          listBackup.push(clauseBackup)

          resultsChunk.push({
            success: true,
            _id: clause._id,
            title
          })

          setImmediate(helperChunk.bind(null, index + 1, cb))
        } catch (err) {
          console.log('asyncLoopsChunk > helperChunk ERROR')
          console.log(err)

          cb(err)
        }
      }

      await StorageRepository.create(listBackup, this.clauseFileBackup)

      // Start the helper.
      helperChunk(0, (error, results) => {
        if (error) return reject(error)
        resolve(results)
      })
    })
  }

  private async asyncLoopsChunkCreateLicenses(
    chunks,
    lengthItems
  ): Promise<string[]> {
    return new Promise((resolve, reject) => {
      let resultsChunk: any = []
      const maxLen = 50
      let porcentagesArray = generateArrayPercentage('.', maxLen)

      async function helperChunk(index, cb) {
        try {
          if (index === lengthItems) {
            cb(null, resultsChunk)
            return
          }

          const count = index + 1
          const avg = (count * maxLen) / lengthItems
          const avgPorcentage = (avg / maxLen) * 100
          porcentagesArray = generateArrayPercentage(
            '#',
            avg + 1,
            porcentagesArray
          )
          console.log(
            new Date(),
            `[${porcentagesArray.join(
              ''
            )}] license ${count}/${lengthItems} (${avgPorcentage.toFixed(1)}%)`
          )

          const row: ILicencesInExcelDTO = chunks[index]

          const name = row.name.trim()
          const slug = generateSlug(name)

          const imageName = row.image.trim()
          const filePath = `${process.cwd()}/dataset/resources/licencias_images/${imageName}`

          if (!existsSyncUtil(filePath)) {
            resultsChunk.push({
              success: false,
              name,
              error: `No pudimos encontrar la image <${imageName}> asociada a la licencia <${name}>.`
            })

            return setImmediate(helperChunk.bind(null, index + 1, cb))
          }

          const termsAndConditionsName = row.termsAndConditions.trim()
          const templatePath = `${process.cwd()}/dataset/resources/licencias_templates/${termsAndConditionsName}`

          if (!existsSyncUtil(templatePath)) {
            resultsChunk.push({
              success: false,
              name,
              error: `No pudimos encontrar el template <${termsAndConditionsName}> asociada a la licencia <${name}>.`
            })

            return setImmediate(helperChunk.bind(null, index + 1, cb))
          }
          const country: CountryDocument = await CountryRepository.findOneId({
            $or: [{ alpha2Code: row.countryId }, { alpha3Code: row.countryId }]
          })

          if (!country) {
            resultsChunk.push({
              success: false,
              name,
              error: `El pais con alphaCode <${row.countryId}> no existe`
            })

            return setImmediate(helperChunk.bind(null, index + 1, cb))
          }
          const company = await CompanyRepository.findOneSelect({
            identifier: row.taxId.trim()
          })
          if (!company) {
            resultsChunk.push({
              success: false,
              name,
              error: `La empresa con identifier <${row.taxId}> no existe`
            })

            return setImmediate(helperChunk.bind(null, index + 1, cb))
          }

          const cropType = await CropTypeRepository.findOneSelect({
            key: row.cropType.trim()
          })

          if (!cropType) {
            resultsChunk.push({
              success: false,
              name,
              error: `El tipo de crop <${row.cropType}> no existe`
            })

            return setImmediate(helperChunk.bind(null, index + 1, cb))
          }

          const { clauseErrors, clauses } = await validateClauses(row)

          const {
            identifierErrors,
            accessibleIdentifier,
            inaccessibleIdentifier
          } = await validateIdentifiers(row)

          const { userErrors, companyUsers } = await validateUsers(row)

          const { verificationTypeErrors, verificationTypeInBD } =
            await validateVerificationType(row)

          if (row.verificationType) {
            if (verificationTypeErrors.length) {
              resultsChunk.push([...verificationTypeErrors])
              return setImmediate(helperChunk.bind(null, index + 1, cb))
            }
          }

          resultsChunk = [
            ...resultsChunk,
            ...clauseErrors,
            ...identifierErrors,
            ...userErrors
          ]

          if (!clauses.length) {
            resultsChunk.push({
              success: false,
              name,
              error: `La licencias <${name}> requiere de clausulas para continuar`
            })

            return setImmediate(helperChunk.bind(null, index + 1, cb))
          }

          const createLicenseDTO = {
            countryId: String(country._id),
            name,
            slug,
            type: row.type,
            previewDescription: row.previewDescription,
            companyId: String(company._id),
            companyIdentifier: company.identifier,
            cropType: String(cropType._id),
            termsAndConditions: name,
            clauses,
            startDatePost: new Date(
              moment(row.startDatePost, 'DD/MM/YYYY').toDate()
            ),
            endDatePost: new Date(
              moment(row.endDatePost, 'DD/MM/YYYY').toDate()
            ),
            startDate: new Date(moment(row.startDate, 'DD/MM/YYYY').toDate()),
            endDate: new Date(moment(row.endDate, 'DD/MM/YYYY').toDate()),
            companyUsers,
            status: row.status,
            hectareLimit: row.hectareLimit,
            hectareMinIdentifier: row.hectareMinIdentifier || 0,
            hectareLimitIdentifier: row.hectareLimitIdentifier || 0,
            timeLeftPost: row.timeLeftPost,
            timeLeftNew: row.timeLeftNew,
            hectareLeftPercentage: row.hectareLeftPercentage,
            idLicense: row.id_license
          } as CreateLicenseDTO

          if (accessibleIdentifier.length) {
            createLicenseDTO.accessibleIdentifier = accessibleIdentifier
          }

          if (inaccessibleIdentifier.length) {
            createLicenseDTO.inaccessibleIdentifier = inaccessibleIdentifier
          }

          if (row.normative) {
            createLicenseDTO.normative = row.normative
            createLicenseDTO.allowIntersection = row.allowIntersection
          }

          if (verificationTypeInBD) {
            createLicenseDTO.verificationType = String(verificationTypeInBD._id)
          }

          const sha256Hash = generateHashLicenses(
            createLicenseDTO as ILicenseProps
          )

          let license: any = await LicenseRepository.findOneLean({
            fieldsHash: sha256Hash.hash
          })
          if (license) {
            resultsChunk.push({
              success: false,
              name,
              message: `Existe una licencia con iguales valores en los siguientes campos <${sha256Hash.fields}>.`
            })

            return setImmediate(helperChunk.bind(null, index + 1, cb))
          }

          createLicenseDTO.fieldsHash = sha256Hash.hash

          const licenseId = new Types.ObjectId()
          const directory = 'licenses'
          const { imageOriginal, imageThumbnail, imageIntermediate } =
            await uploadImages(licenseId, directory, imageName, filePath)
          const fileResponse = await createFilePrivateUseCase.execute({
            filePath: templatePath,
            directory,
            entityId: String(licenseId)
          })

          const file = fileResponse.value

          if (fileResponse.isLeft()) {
            resultsChunk.push({
              success: false,
              name,
              message: `No puimos cargar el template a la licencia <${name}>.`
            })

            return setImmediate(helperChunk.bind(null, index + 1, cb))
          }

          const termsAndConditionsTemplate = file.getValue()

          license = {
            ...createLicenseDTO,
            _id: licenseId,
            id: uuid(),
            imageOriginal,
            imageThumbnail,
            imageIntermediate,
            termsAndConditionsTemplate
          }

          await LicenseRepository.create(license)

          resultsChunk.push({
            success: true,
            _id: license._id,
            name
          })

          setImmediate(helperChunk.bind(null, index + 1, cb))
        } catch (err) {
          console.log('asyncLoopsChunkLicenses > helperChunk ERROR')
          console.log(err)

          cb(err)
        }
      }

      // Start the helper.
      helperChunk(0, (error, results) => {
        if (error) return reject(error)
        resolve(results)
      })
    })
  }

  private async asyncLoopsChunkCreateSubLicenses(
    chunks,
    lengthItems
  ): Promise<string[]> {
    return new Promise((resolve, reject) => {
      let resultsChunk: any = []
      const maxLen = 50
      let porcentagesArray = generateArrayPercentage('.', maxLen)

      async function helperChunk(index, cb) {
        try {
          if (index === lengthItems) {
            cb(null, resultsChunk)
            return
          }

          const count = index + 1
          const avg = (count * maxLen) / lengthItems
          const avgPorcentage = (avg / maxLen) * 100
          porcentagesArray = generateArrayPercentage(
            '#',
            avg + 1,
            porcentagesArray
          )
          console.log(
            new Date(),
            `[${porcentagesArray.join(
              ''
            )}] sublicense ${count}/${lengthItems} (${avgPorcentage.toFixed(
              1
            )}%)`
          )

          const row: ISubLicencesInExcelDTO = chunks[index]

          const imageName = row.image.trim()
          const filePath = `${process.cwd()}/dataset/resources/subLicencias_images/${imageName}`

          if (!existsSyncUtil(filePath)) {
            resultsChunk.push({
              success: false,
              error: `No pudimos encontrar la image <${imageName}> asociada a la sub licencia.`
            })

            return setImmediate(helperChunk.bind(null, index + 1, cb))
          }

          const company = await CompanyRepository.findOneSelect({
            identifier: row.taxId.trim()
          })

          if (!company) {
            resultsChunk.push({
              success: false,
              error: `La empresa con identifier <${row.taxId}> no existe`
            })

            return setImmediate(helperChunk.bind(null, index + 1, cb))
          }

          const { licenseError, licenseInBD } = await validateLicense(row)

          if (!licenseError.success) {
            resultsChunk.push({
              success: false,
              error: licenseError.error
            })
            return setImmediate(helperChunk.bind(null, index + 1, cb))
          }

          const {
            identifierErrors,
            accessibleIdentifier,
            inaccessibleIdentifier
          } = await validateIdentifiers(row)

          const { userErrors, companyUsers } = await validateUsers(row)

          resultsChunk = [...resultsChunk, ...identifierErrors, ...userErrors]

          const createSubLicenseDTO = {
            licenseId: String(licenseInBD._id),
            companyId: String(company._id),
            companyIdentifier: company.identifier,
            companyUsers,
            status: row.status,
            hectareLimit: row.hectareLimit,
            hectareMinIdentifier: row.hectareMinIdentifier || 0,
            hectareLimitIdentifier: row.hectareLimitIdentifier || 0
          } as CreateSubLicenseDTO

          if (accessibleIdentifier.length) {
            createSubLicenseDTO.accessibleIdentifier = accessibleIdentifier
          }

          if (inaccessibleIdentifier.length) {
            createSubLicenseDTO.inaccessibleIdentifier = inaccessibleIdentifier
          }

          const { error } = createSubLicenseSchema.validate(createSubLicenseDTO)

          if (error) {
            resultsChunk.push({
              success: false,
              error: error.message
            })
            return setImmediate(helperChunk.bind(null, index + 1, cb))
          }

          const sha256Hash = generateHashSubLicenses(
            createSubLicenseDTO as SubLicense
          )

          let subLicense: any = await SubLicenseRepository.findOneLean({
            $or: [
              { fieldsHash: sha256Hash.hash },
              { idSublicense: Number(row.id_sublicense) }
            ]
          })
          if (subLicense) {
            resultsChunk.push({
              success: false,
              id_sublicense: row.id_sublicense,
              message: `Existe una sub licencia con iguales valores en los siguientes campos <${sha256Hash.fields}>. o el mismo id de sublicencia`
            })

            return setImmediate(helperChunk.bind(null, index + 1, cb))
          }

          createSubLicenseDTO.fieldsHash = sha256Hash.hash

          const subLicenseId = new Types.ObjectId()
          const directory = 'sublicenses'
          const { imageOriginal, imageThumbnail, imageIntermediate } =
            await uploadImages(subLicenseId, directory, imageName, filePath)

          subLicense = {
            ...createSubLicenseDTO,
            _id: subLicenseId,
            idSublicense: Number(row.id_sublicense),
            id: uuid(),
            image: imageOriginal,
            imageThumbnail,
            imageIntermediate
          }

          await SubLicenseRepository.create(subLicense)
          // asociate subLicense to License
          const licenseSublicenses = licenseInBD.subLicenses ?? []
          licenseSublicenses.push(subLicenseId.toString())
          await LicenseRepository.updateOne(
            { _id: licenseInBD._id },
            { $set: { subLicenses: licenseSublicenses } }
          )
          resultsChunk.push({
            success: true,
            _id: subLicense._id
          })

          setImmediate(helperChunk.bind(null, index + 1, cb))
        } catch (err) {
          console.log('asyncLoopsChunkSubLicenses > helperChunk ERROR')
          console.log(err)

          cb(err)
        }
      }

      // Start the helper.
      helperChunk(0, (error, results) => {
        if (error) return reject(error)
        resolve(results)
      })
    })
  }

  private async asyncLoopsChunkCreateVerifierCompanies(
    chunks,
    lengthItems
  ): Promise<string[]> {
    return new Promise((resolve, reject) => {
      const resultsChunk: any = []
      const maxLen = 50
      let porcentagesArray = generateArrayPercentage('.', maxLen)

      async function helperChunk(index, cb) {
        try {
          if (index === lengthItems) {
            cb(null, resultsChunk)
            return
          }

          const count = index + 1
          const avg = (count * maxLen) / lengthItems
          const avgPorcentage = (avg / maxLen) * 100
          porcentagesArray = generateArrayPercentage(
            '#',
            avg + 1,
            porcentagesArray
          )
          console.log(
            new Date(),
            `[${porcentagesArray.join(
              ''
            )}] verifierCompanies ${count}/${lengthItems} (${avgPorcentage.toFixed(
              1
            )}%)`
          )

          const row: IVerifierCompanies = chunks[index]

          const { verifierCompaniesErrors, verifierCompanies } =
            await validateVerifierCompaniesAndUsers(row)

          if (verifierCompaniesErrors.length) {
            resultsChunk.push([verifierCompaniesErrors])
            return setImmediate(helperChunk.bind(null, index + 1, cb))
          }

          const { licenseError, licenseInBD } = await validateLicense(row)

          if (!licenseError.success) {
            resultsChunk.push({
              success: false,
              error: licenseError.error
            })
            return setImmediate(helperChunk.bind(null, index + 1, cb))
          }

          await LicenseRepository.updateOne(
            { _id: licenseInBD._id },
            { $set: { verifierCompanies: verifierCompanies } }
          )
          resultsChunk.push({
            success: true,
            _id: licenseInBD._id
          })

          setImmediate(helperChunk.bind(null, index + 1, cb))
        } catch (err) {
          console.log('asyncLoopsChunkSubLicenses > helperChunk ERROR')
          console.log(err)

          cb(err)
        }
      }

      // Start the helper.
      helperChunk(0, (error, results) => {
        if (error) return reject(error)
        resolve(results)
      })
    })
  }
}
