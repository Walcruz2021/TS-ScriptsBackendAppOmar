import { FileDocDocument } from '../Interfaces'
import FileDocumentRepositoryContract from '../../../Contracts/FileDocumentRepositoryContract'
import { CreateFileSyncDTO } from '../Interfaces/FileDocument.interface'
import axios from 'axios'

export default class FileDocumentRepository
  implements FileDocumentRepositoryContract
{
  constructor(private fileDocModel) {}
  public async findOne<Object>(query: Object): Promise<FileDocDocument> {
    return this.fileDocModel.findOne(query)
  }

  public async findAll<Object>(query: Object): Promise<FileDocDocument[]> {
    return this.fileDocModel.find(query)
  }

  public async updateOne<Object>(query: Object, data): Promise<any> {
    return this.fileDocModel.updateOne(query, data)
  }
  public async deleteOne<Object>(query: Object): Promise<any> {
    return this.fileDocModel.deleteOne(query)
  }
  public async findWithCursor(pipelines: Record<string, any>[]): Promise<any> {
    return this.fileDocModel.aggregate(pipelines).cursor()
  }
  public async count(pipelines: Record<string, any>[]): Promise<any[]> {
    return this.fileDocModel.aggregate(pipelines)
  }

  public async update<Object>(query: Object, querySet: Object): Promise<any> {
    return this.fileDocModel.update(query, querySet)
  }

  public async findOneAndUpdate<Object>(
    query: Object,
    querySet: Object
  ): Promise<any> {
    return this.fileDocModel.findOneAndUpdate(query, querySet)
  }

  public async create<FileDocument>(
    data: FileDocument
  ): Promise<FileDocDocument> {
    return this.fileDocModel.create(data)
  }

  public async saveSync(options: CreateFileSyncDTO) {
    const { url, body, headers } = options
    return this.saveFileSync(url, body, headers)
  }
  public async getSync(url: string): Promise<any> {
    return this.getFileSync(url)
  }

  /**
   * Make Request ES6 HTTP.
   *
   * @function saveFileSync
   * @param url
   * @param body
   * @param [headers]
   */
  public async saveFileSync(url: string, body: any, headers?: any) {
    return new Promise((resolve, reject) =>
      axios
        .post(url, body, { headers })
        .then(({ data }) => resolve(data))
        .catch((err) => {
          reject(err)
        })
    )
  }

  /**
   * Make Request ES6 HTTP.
   * @function getFileSync
   * @param url
   */
  public async getFileSync(url: string) {
    return new Promise((resolve, reject) =>
      axios
        .get(url)
        .then(({ data }) => resolve(data))
        .catch((err) => {
          reject(err)
        })
    )
  }
}
