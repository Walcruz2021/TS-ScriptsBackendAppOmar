export default interface CollectionVersionRepositoryContract {
  createOrUpdate<T>(query: T): Promise<any>
  deleteMany(): Promise<any>
}
