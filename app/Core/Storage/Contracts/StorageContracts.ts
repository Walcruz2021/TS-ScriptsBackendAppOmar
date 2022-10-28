export default interface StorageContract {
  get<T>(path: T)
  create<T>(data: T, name?: string)
  delete<T>(path: T)
}
