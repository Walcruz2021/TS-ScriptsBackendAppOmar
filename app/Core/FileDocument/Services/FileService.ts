import { createReadStreamUtil, formDataAppend } from '../Files'
import Env from '@ioc:Adonis/Core/Env'
import axios from 'axios'
import FormData from 'form-data'
import OpenTimestamps from 'javascript-opentimestamps'
// eslint-disable-next-line @typescript-eslint/naming-convention
export interface IFileCreate {
  directory: string
  entityId: string
  filePath: string
}

export class FileService {
  public static async createFilePublic(
    filePath: string,
    entityId: string,
    directory: string
  ) {
    return new Promise((resolve, reject) => {
      const url = `${Env.get(
        'MS_FILES_URL'
      )}/api/v1/files?directory=${directory}&entityId=${entityId}`
      const form = formDataAppend('file', createReadStreamUtil(filePath))
      const formHeaders = form.getHeaders()
      const data = {
        body: form,
        headers: {
          ...formHeaders
        }
      }

      this.saveFileSync(url, data.body, data.headers).then(
        (result) => {
          resolve(result)
        },
        (err) => {
          reject(err)
        }
      )
    })
  }

  public static async createFilePrivate(
    filePath: string,
    entityId: string,
    directory: string
  ) {
    return new Promise(async (resolve, reject) => {
      let url = ''
      if (entityId) {
        url = `${Env.get(
          'MS_FILES_URL'
        )}/v1/files/private?directory=${directory}&entityId=${entityId}`
      } else {
        url = `${Env.get(
          'MS_FILES_URL'
        )}/v1/files/private?directory=${directory}`
      }

      const form = formDataAppend('file', createReadStreamUtil(filePath))
      const formHeaders = form.getHeaders()
      const data = {
        body: form,
        headers: {
          ...formHeaders
        }
      }

      await this.saveFileSync(url, form, data.headers).then(
        (result) => {
          resolve(result)
        },
        (err) => {
          console.log(err)
          reject(err)
        }
      )
    })
  }

  public formDataAppend(filename, file) {
    const form = new FormData()
    form.append(filename, file)
    return form
  }

  public static async saveFileSync(url: string, body: any, headers?: any) {
    return axios
      .post(url, body, {
        headers,
        maxBodyLength: Infinity,
        maxContentLength: Infinity
      })
      .then(({ data }) => data)
      .catch((err) => {
        throw this.axiosParseError(err)
      })
  }

  private static axiosParseError(err) {
    const { response = {} } = err
    const { status = 500, data = {} } = response
    const { code = status, message = err.toString(), description } = data
    let msg = message
    if (typeof data === 'string') {
      msg = data.toString()
    }
    return {
      status,
      data: {
        ...data,
        code,
        message: msg,
        description
      },
      errorToString: err.toString()
    }
  }
  public static async stampHash(
    hash: string
  ): Promise<{ ots: string; fileOts: Array<any> }> {
    const buff = Buffer.from(hash, 'hex')
    const ops = new OpenTimestamps.Ops.OpSHA256()
    const detached = OpenTimestamps.DetachedTimestampFile.fromHash(ops, buff)

    await OpenTimestamps.stamp(detached)
    const fileOts = detached.serializeToBytes()

    return Promise.resolve({ ots: this.toHexString(fileOts), fileOts })
  }

  /**
   * Create Hex String.
   *
   * @param byteArray
   */
  public static toHexString(byteArray: any): string {
    return Array.from(byteArray, (byte: any) => {
      return ('0' + (byte & 0xff).toString(16)).slice(-2)
    }).join('')
  }
}
