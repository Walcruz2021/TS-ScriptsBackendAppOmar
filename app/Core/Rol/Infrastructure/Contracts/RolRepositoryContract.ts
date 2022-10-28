export default interface RolRepositoryContract {
  findAll<T>(query: T): Promise<any[]>
  findOne(query: any): Promise<any>
  updateOne<T>(query: T, data: T): Promise<any>
  findOneAndUpdate<T>(query: T, querySet: T): Promise<any>
}
