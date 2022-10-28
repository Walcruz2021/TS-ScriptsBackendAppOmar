export default interface FileLogLotRepositoryContract {
  updateOne<T>(query: T, querySet: T): Promise<any>
  cursor<T>(pipelines: T[]): Promise<any>
  count<T>(pipelines: T[]): Promise<any>
}
