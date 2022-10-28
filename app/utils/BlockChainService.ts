import PDF from '../utils/pdf/PDF'
import StorageRepository from 'App/Core/Storage'
import { join } from 'path'
import { FileService } from 'App/Core/FileDocument/Services/FileService'
class BlockChainServices {
  /**
   * Create PDF and Register Sign in BlockChain with timestamp.
   *
   * @param crop
   * @param activity
   * @param user
   */
  public static async sign(crop, activity): Promise<any> {
    const nameFile = `${activity.key}-${activity.type.name.es}-sing.pdf`

    const { hash, path } = await PDF.generatePdfSign({
      pathFile: `${nameFile}`,
      crop: crop,
      activity: activity
    })

    const { ots, fileOts } = await FileService.stampHash(hash)

    const otsObject = await this.saveOtsFile(fileOts, `${nameFile}.ots`)

    return Promise.resolve({
      ots,
      hash,
      pathPdf: path,
      nameFilePdf: nameFile,
      ...otsObject
    })
  }

  public static async saveOtsFile(fileOtsBytes: any, nameFile): Promise<any> {
    await StorageRepository.create(fileOtsBytes, nameFile)

    return Promise.resolve({
      nameFileOts: nameFile,
      pathOtsFile: `${basePath()}`
    })
  }
}

export default BlockChainServices

export function basePath(): string {
  return join(__dirname, '../../../tmp/')
}
