export default interface CropMigratedMemberContract {
  create<T>(data: T)
  findOne<T>(query: T): Promise<any>
  updateOne<T>(query: T, data): Promise<any>
}
