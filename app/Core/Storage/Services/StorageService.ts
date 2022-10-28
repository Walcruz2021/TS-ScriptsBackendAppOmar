import StorageRepository from 'App/Core/Storage'
import { existsSync } from 'fs'

export default class StorageService {
  public static async create(data, namePath): Promise<void> {
    if (!data) {
      throw new Error(`Error: The data is undefined`)
    }
    return StorageRepository.create(data, namePath)
  }

  public static async add(data, namePath): Promise<void> {
    const currentData = await this.get(namePath)
    if (!data) {
      throw new Error(`Error: The data is undefined`)
    }
    return StorageRepository.create(this.mergeData(currentData, data), namePath)
  }
  public static async get(namePath): Promise<any | any[]> {
    const exists = await this.fileExists(namePath)
    if (!exists) {
      throw new Error(`Error: The ${namePath} file does not exist`)
    }
    return StorageRepository.get(namePath)
  }
  public static async delete(namePath) {
    return StorageRepository.delete(namePath)
  }

  private static mergeData(currentData, data): any | any[] {
    if (!Array.isArray(currentData) && !Array.isArray(data)) {
      return Object.assign(currentData, data)
    }
    if (Array.isArray(currentData) && !Array.isArray(data)) {
      currentData.push(data)
      return currentData
    }
    if (!Array.isArray(currentData) && !Array.isArray(data)) {
      currentData.push(data)
      return currentData
    }
    return currentData.concat[data]
  }
  public static async fileExists(fileName): Promise<boolean> {
    const filePath = await StorageRepository.getPath(fileName)
    return existsSync(filePath)
  }
}
