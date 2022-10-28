export default interface CountryRepositoryContract {
  findAll<T>(query: T): Promise<any[]>
  findOneId<T>(query: T): Promise<any>
  updateOne<T>(query: T, data: T): Promise<any>
}
