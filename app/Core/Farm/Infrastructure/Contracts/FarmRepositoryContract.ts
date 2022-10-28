export default interface FarmRepositoryContract {
  findAll<T>(query: T): Promise<any[]>
  findOneId<T>(query: T): Promise<any>
  create<T>(data: T): Promise<any>
  updateOne<T>(query: T, data: T): Promise<any>
  findOneAndUpdate<T>(query: T, querySet: T): Promise<any>
}
