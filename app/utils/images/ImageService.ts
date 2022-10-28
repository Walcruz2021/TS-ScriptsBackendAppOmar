import sharp from 'sharp'
import mime from 'mime'
import { readFileSyncUtil, unlinkSyncUtil } from '../utils'

interface ResizeImageParameters {
  filePath: string
  width: number
  height: number
  fit?: string
}

class ImageService {
  public static async getFileExt(fileName) {
    const fileNameParts = fileName.split('.')
    // eslint-disable-next-line no-new-wrappers
    const fileExt = new String(fileNameParts[fileNameParts.length - 1])
      .toLocaleLowerCase()
      .trim()
    return fileExt
  }

  public static async getMimeType(file) {
    // @ts-ignore
    return mime.getType(file)
  }

  public static async unlinkFiles(files: string[]) {
    files.forEach((path) => {
      unlinkSyncUtil(path)
    })
  }

  public static async resizeAsync(
    filePath,
    fileName,
    destination,
    width,
    height
  ) {
    const inputBuffer = readFileSyncUtil(filePath)
    const original = await this.saveFileOriginal(
      inputBuffer,
      `${destination}/original-${fileName}`
    )
    const thumbnail = await this.resize(inputBuffer, {
      width: 150,
      height: 150,
      fit: 'cover',
      filePath: `${destination}/thumbnail-${fileName}`
    })

    const intermediate = await this.resize(inputBuffer, {
      width,
      height,
      fit: 'contain',
      filePath: `${destination}/intermediate-${fileName}`
    })

    return {
      original,
      thumbnail,
      intermediate
    }
  }

  public static async resizeAsyncImageFromS3(
    inputBuffer,
    fileName,
    destination,
    width,
    height
  ) {
    const original = await this.saveFileOriginal(
      inputBuffer,
      `${destination}/original-${fileName}`
    )
    const thumbnail = await this.resize(inputBuffer, {
      width: 150,
      height: 150,
      fit: 'cover',
      filePath: `${destination}/thumbnail-${fileName}`
    })

    const intermediate = await this.resize(inputBuffer, {
      width,
      height,
      fit: 'contain',
      filePath: `${destination}/intermediate-${fileName}`
    })

    return {
      original,
      thumbnail,
      intermediate
    }
  }

  /**
   * Resize Image
   *
   * @param Buffer inputBuffer
   * @param ResizeImageParameters parameters
   */
  private static async resize(
    inputBuffer: Buffer,
    parameters: ResizeImageParameters
  ) {
    const { filePath, width, height, fit } = parameters
    await sharp(inputBuffer)
      .resize(width, height, {
        fit: fit || 'cover'
      })
      .toFile(filePath)
    return filePath
  }

  private static async saveFileOriginal(inputBuffer: Buffer, filePath: string) {
    await sharp(inputBuffer).toFile(filePath)
    return filePath
  }
}

export default ImageService
