import { StorageContract } from '../Contracts'
export default class FileStorageRepository implements StorageContract {
  constructor(private storage) {}

  public async get<String>(path: String) {
    return this.storage.get(path)
  }
  public async getPath<String>(path: String) {
    return this.storage.getPath(path)
  }
  public async create<T>(data: T, name: string) {
    return this.storage.save(data, name)
  }
  public async delete<String>(name: String) {
    this.storage.delete(name)
  }
}
