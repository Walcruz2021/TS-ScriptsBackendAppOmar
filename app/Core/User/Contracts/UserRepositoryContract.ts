export default interface UserRepositoryContract {
  create<T>(data: T)
  findOne<T>(query: T): Promise<any>
  deleteOne<T>(query: T): Promise<any>
  findOneAndUpdate<T>(query: T, querySet: T): Promise<any>
}
