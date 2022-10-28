export default interface CompanyTypeRepositoryContract {
  create<T>(data: T): Promise<any>
  findAll<T>(query: T): Promise<any[]>
}
