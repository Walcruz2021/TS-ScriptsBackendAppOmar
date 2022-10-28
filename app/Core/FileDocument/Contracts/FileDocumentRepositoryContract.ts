export default interface FileDocumentRepositoryContract {
  findOne<T>(query: T): Promise<any>
  findAll<T>(query: T): Promise<any[]>
  updateOne<T>(query: T, data): Promise<any>
  deleteOne<T>(query: T): Promise<any>
  findWithCursor<T>(pipelines: T[]): Promise<any>
  count<T>(pipelines: T[]): Promise<any[]>
}
