export default interface CropRepositoryContract {
  findAll<T>(query: T, populate?: Array<T>): Promise<any[]>
  findOne(query: any): Promise<any>
  findOneWithLots(query: any): Promise<any>
  findOneAndUpdate<T>(query: T, querySet: T): Promise<any>
}
