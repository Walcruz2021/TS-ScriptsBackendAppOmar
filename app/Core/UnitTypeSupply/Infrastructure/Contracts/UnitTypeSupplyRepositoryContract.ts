export default interface UnitTypeSupplyRepositoryContract {
  findAll<T>(query: T): Promise<any[]>
  findOne<T>(query: T): Promise<any>
  updateOne<T>(query: T, querySet: T): Promise<any>
  findOneAndUpdate<T>(query: T, querySet: T): Promise<any>
  findByCursor<T>(query: T)
  create<T>(data: T)
  count<T>(query: T): Promise<number>
  deleteOne<T>(query: T): Promise<any>
}