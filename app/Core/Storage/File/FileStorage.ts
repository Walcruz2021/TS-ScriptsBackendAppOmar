import fs, { promises as fsPromise } from 'fs'

export default class FileStorage {
  private path: string
  private data: string
  constructor(path: string) {
    this.path = path
  }

  public async get(name: string) {
    let data: any = fs.readFileSync(`${this.path}/${name}`)
    return JSON.parse(data)
  }

  public async save<T>(data: T, nameFile: string) {
    this.validateDirTmp()
    this.data = JSON.stringify(data)
    return fsPromise.writeFile(`${this.path}/${nameFile}`, this.data, 'utf8')
  }

  public async delete(name: string): Promise<void> {
    if (this.dirExist(`${this.path}/${name}`)) {
      fs.unlinkSync(`${this.path}/${name}`)
    }
  }

  private dirExist(dir: string): boolean {
    if (fs.existsSync(dir)) {
      return true
    }
    return false
  }

  /**
   * @function validateDirTmp
   * @description Validate if the tmp directory exists
   * */

  private validateDirTmp() {
    if (!fs.existsSync(this.path)) {
      fs.mkdirSync(this.path)
    }
  }
  public async getPath(name: string) {
    return `${this.path}/${name}`
  }
}
