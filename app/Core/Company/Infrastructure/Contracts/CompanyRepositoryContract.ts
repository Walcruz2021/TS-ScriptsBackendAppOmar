export default interface CompanyRepositoryContract {
  create<T>(data: T)
  findOne<T>(query: T): Promise<any>
  updateOne<T>(query: T, data): Promise<any>
  deleteOne<T>(query: T): Promise<any>
  count<T>(query: T): Promise<number>
}
