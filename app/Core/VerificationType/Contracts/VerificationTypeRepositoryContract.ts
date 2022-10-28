export default interface VerificationTypeRepositoryContract {
  create<T>(data: T)
  deleteOne<T>(query: T): Promise<any>
  findOne<T>(query: T): Promise<any>
}
