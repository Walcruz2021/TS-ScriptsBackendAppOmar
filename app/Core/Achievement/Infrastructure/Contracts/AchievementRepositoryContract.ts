export default interface AchievementRepositoryContract {
  findAll<T>(query: T): Promise<any[]>
  findOne<T>(query: T): Promise<any>
  findOneAndUpdate<T>(query: T, querySet: T): Promise<any>
  findByCursor<T>(query: T)
  create<T>(data: T)
  count<T>(query: T): Promise<number>
  updateMany<T>(query: T, querySet: T): Promise<any>
}
