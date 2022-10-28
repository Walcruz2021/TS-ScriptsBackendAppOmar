import fs from 'fs'
import { PDFDocument } from 'pdf-lib'
import htmlToPDF from 'html-pdf-node'
import sha256 from 'sha256'
import _ from 'lodash'
import { createDocumentSign } from './TemplateSign'
import { IDataContentPdf } from './PdfTypes'
import UserRepository from 'App/Core/User/Infrastructure/Mongoose/Repositories'
import CompanyRepository from 'App/Core/Company/Infrastructure/Mongoose/Repositories'
import { parseCoordinates } from '../ParseCoordinates'
import StorageRepository from 'App/Core/Storage'
import { join } from 'path'
import Env from '@ioc:Adonis/Core/Env'
import { API_CORE_PATH_BASE } from 'App/utils'
import { readFileSync, existsSync } from 'fs'

class PDF {
  /**
   * Generate PDF document.
   *
   * @param IDataContentPdf data
   *
   * @returns
   */
  public static async generate(
    data: IDataContentPdf
  ): Promise<{ hash: string; path: string }> {
    const { content, pathFile } = data
    const pdfBytes = await htmlToPDF.generatePdf({ content }, { format: 'A4' })

    const hash = sha256(pdfBytes)

    fs.writeFileSync(pathFile, pdfBytes)
    return Promise.resolve({
      hash,
      path: pathFile
    })
  }

  /**
   * Generate PDF Document to Sign Activities.
   *
   * @param IDataContentPdf data
   * @returns
   */
  public static async generatePdfSign(
    data: IDataContentPdf
  ): Promise<{ hash: string; path: string }> {
    const { crop, activity, pathFile } = data
    const contentCrop = await this.generateCropTemplate(crop)
    const contentActivity = this.generateActivityTemplate(activity)
    const achievements = await this.listAchievements(activity)
    const evidences = this.generateEvidences(activity)
    const signers = await this.generateSignersTemplate(activity)

    const contentDocumentHtml = createDocumentSign(
      contentCrop,
      contentActivity,
      achievements,
      evidences,
      signers
    )

    const pdfBytes = await htmlToPDF.generatePdf(
      { content: contentDocumentHtml },
      { format: 'A4' }
    )
    const pdfBytesWithAttachment = await this.attachPdfDocs(activity, pdfBytes)

    const hash = sha256(pdfBytes)

    // console.log(basePath())
    // fs.mkdirSync(basePath() + 'pdf-sings/wcuNvW9Dh', {
    //   recursive: true,
    // })
    await StorageRepository.create(pdfBytesWithAttachment, pathFile)
    //fs.writeFileSync(pathFile, pdfBytesWithAttachment)
    return Promise.resolve({
      hash,
      path: pathFile
    })
  }

  private static async generateCropTemplate(crop) {
    const companyProducer = await this.getCompanyProducer(crop)
    return `
          <ul>
            <li>Cultivo: ${crop.cropType.name.es} </li>
            <li>CUIT: ${companyProducer?.identifier ?? ''}</li>
            <li>Razón Social: ${companyProducer?.name ?? ''}</li>
            <li>Superficie Total: ${crop.surface}</li>
            <li>Fecha de Siembra Estimada: ${crop.dateCrop.toLocaleDateString(
              'es-ES',
              {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }
            )}</li>
            <li>Fecha de Cosecha Estimada: ${crop.dateHarvest.toLocaleDateString(
              'es-ES',
              {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }
            )}</li>
          </ul>
        `
  }

  private static generateActivityTemplate(activity) {
    return `
        <ul>
          <li>Nombre: ${activity.type.name.es} ${
      activity.typeAgreement ? activity.typeAgreement.name.es : ''
    } </li>
        ${activity.pay ? `<li>Rinde: ${activity.pay}</li>` : ''} ${
      activity.unitType ? `<li>Unidad: ${activity.unitType.name.es}</li>` : ''
    }
        ${activity.observation ? `<li>${activity.observation}</li>` : ''}
        ${
          activity.dateObservation
            ? `<li>${activity.dateObservation.toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</li>`
            : ''
        }
          ${this.generateLotsSelected(activity)}
        </ul>
    `
  }

  private static generateEvidences(activity) {
    const evidencesAchievements = activity.achievements.map(
      (achievement) => achievement.files
    )

    const evidencesImageAchievements = [
      ...this.readImagesPngFiles(evidencesAchievements),
      ...this.readImagesJpgFiles(evidencesAchievements)
    ]

    const evidencesImageActivity = [
      ...this.readImagesPngFiles(activity.files),
      ...this.readImagesJpgFiles(activity.files)
    ]
    const evidences = [
      ...evidencesImageActivity,
      ...evidencesImageAchievements
    ].filter((item) => item)

    return this.generateEvidenceImage(evidences)
  }

  private static generateEvidenceImage(evidences) {
    let list = ''
    for (const evidence of evidences) {
      list += `
      <h4>${evidence.date}</h4>
      <div class="image-evidence">
        <img with="250" height="250" src=${evidence.file}>
      </div>`
    }

    return list
  }

  private static generateLotsSelected(activity) {
    return `
    <li>Lotes Seleccionados:</li>
    <li>
      <ul>${this.createStringLot(activity.lots)}</lu>
    </li>
    `
  }

  private static async listAchievements(activity) {
    return `
    <h5>Realización</h5>
    <ul>
    ${await this.generateAchievement(activity.achievements)}
    </ul>
    `
  }

  private static async attachPdfDocs(activity: any, pdfBytes: ArrayBuffer) {
    const pdfDoc = await PDFDocument.load(pdfBytes)

    const evidenceAchievements = activity.achievements.flatMap(
      (achievement) => achievement.files
    )

    const files = activity.files.concat(evidenceAchievements)

    for (const evidence of files) {
      let i = 1
      let absolutePath = getAbsolutePath(evidence.path)
      let existsPath = existsSync(absolutePath)
      if (!existsPath) {
        absolutePath = getAbsolutePath(evidence.pathServer)
      }
      const buffer = readFileSync(absolutePath)

      await pdfDoc.attach(buffer, `attachment-${i}.pdf`, {
        mimeType: 'application/pdf',
        description: 'Documento PDF Evidencia',
        creationDate: new Date(),
        modificationDate: new Date()
      })
      i++
    }

    return pdfDoc.save()
  }

  private static async generateSignersTemplate(activity) {
    let listSigners = ''
    if (activity.achievements.length > 0) {
      const signers = activity.achievements.map((item) => item.signers)
      listSigners = await this.listSigners(
        _.uniqBy(_.flatten(signers), 'email')
      )
    } else {
      listSigners = await this.listSigners(activity.signers)
    }

    return `
      <ul>
      ${listSigners}
      </ul>
      <p>Hora Firma: ${new Date()}</p>
    `
  }

  private static async generateAchievement(achievements) {
    let list = ''
    for (const achievement of achievements) {
      list += `
      <li>Fecha de realización: ${achievement.dateAchievement.toLocaleDateString(
        'es-ES',
        {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }
      )}</li>
			<li>Lotes Seleccionados:</li>
			<li>
				<ul>
					${this.createStringLot(achievement.lots)}
				</ul>
			</li>
			<li>Insumos Seleccionados</li>
			<li>
				<ul>
					${this.listSupplies(achievement.supplies)}
				</ul>
			</li>
			<li>Destinos:</li>
			<li>
				<ul>
					${this.listDestination(achievement.destination)}
				</ul>
			</li>
			<li>Firmantes</li>
			<li>
        <ul>
				  ${await this.listSigners(achievement.signers)}
        </ul>
			</li>
      `
    }

    return list
  }

  private static async listSigners(signers) {
    let users = ''

    for (const sign of signers) {
      if (sign.signed) {
        const user: any = await UserRepository.findOne({ _id: sign.userId })

        users += `<li>${user.firstName} ${user.lastName}</li>`
      }
    }

    return users
  }

  private static listSupplies(supplies) {
    let list = ''

    for (const input of supplies) {
      list += `<li>Nombre: ${input.name}, Unidad: ${input.unit}, Cantidad: ${input.quantity}</li>
      `
    }

    return list
  }

  private static listDestination(destinations) {
    let list = ''
    for (const destination of destinations) {
      list += `<li>Unidad: ${destination.tonsHarvest} ${destination.label} - Destino: ${destination.destinationAddress}</li>`
    }

    return list
  }

  private static readImagesPngFiles(files: any) {
    return _.flatten(files)
      .map((item) => {
        // @ts-ignore
        const arrayNameFile = item.nameFile.split('.')
        if (arrayNameFile[1].match('pdf') !== null) {
          // @ts-ignore
          const path = item.imagePathIntermediate
          return {
            file: path,
            // @ts-ignore
            date: `Fecha de evidencia: ${item._doc.date.toLocaleDateString(
              'es-ES'
            )}`
          }
        }
        return undefined
      })
      .filter((item) => item)
  }

  private static readImagesJpgFiles(files: any) {
    return _.flatten(files)
      .map((item) => {
        // @ts-ignore
        const arrayNameFile = item.nameFile.split('.')
        if (arrayNameFile[1].match('pdf') !== null) {
          // @ts-ignore
          const path = item.imagePathIntermediate
          return {
            file: path,
            // @ts-ignore
            date: `Fecha de evidencia ${item._doc.date.toLocaleDateString(
              'es-ES'
            )}`
          }
        }
        return undefined
      })
      .filter((item) => item)
  }

  private static createStringLot(lots) {
    let listLots = ''

    for (const lot of lots) {
      const area = lot.area
        ? lot.area
        : lot.geometryData
        ? lot.geometryData.coordinates.flatMap((item) => item)
        : []
      listLots += `
      <li>
      ${lot.name}, ${lot.surface}, Coordenadas: ${this.createStringCoordinate(
        parseCoordinates(area)
      )}
      </li>`
    }

    return listLots
  }

  private static createStringCoordinate(coordinates) {
    let coordinatesLiteral = ''

    for (const coordinate of coordinates) {
      coordinatesLiteral = `${coordinate.latitude},${coordinate.longitude}`
    }

    return coordinatesLiteral
  }

  private static getCompanyProducer(crop, type = 'PRODUCER'): any {
    const member = crop.members.filter((item) => item.type === type)[0]

    return CompanyRepository.findOne({ identifier: member.identifier })
  }
}

export default PDF

export function basePath(): string {
  return join(__dirname, '../../../tmp/')
}

/**
 * Concat the absolute path of the api core with the file path.
 */
function getAbsolutePath(path): string {
  if (/^public/.test(path)) {
    return `${Env.get(API_CORE_PATH_BASE)}${path}`
  }
  if (/uploads/.test(path)) {
    return `${Env.get(API_CORE_PATH_BASE)}/public/${path}`
  }
  return `/${path}`
}
