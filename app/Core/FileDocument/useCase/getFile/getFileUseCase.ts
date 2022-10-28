import { IFileProps } from '../../Infrastructure/Mongoose/Interfaces/FileDocument.interface'
import Env from '@ioc:Adonis/Core/Env'
import { Either, left, Result, right } from 'App/Core/utils/Result'
import { GenericAppError } from 'App/Core/utils/AppError'
import { FileErrors } from '../FileErrors'

type Response = Either<
  GenericAppError.UnexpectedError | FileErrors.FileInvalid | Result<any>,
  Result<void | IFileProps>
>

export class GetFileUseCase {
  constructor(private entityRepo) {}

  public async execute(fileKey: string): Promise<Response> {
    let entity: any
    try {
      const msFilesUrl = Env.get('MS_FILES_URL')
      const url = `${msFilesUrl}/v1/files?fileKey=${fileKey}`
      entity = await this.entityRepo.getSync(url)
    } catch (err) {
      console.log('GetFileUseCase Err')
      console.log(err)
      return left(new FileErrors.FileInvalid(err)) as Response
    }

    return right(Result.ok<any>(entity)) as Response
  }
}
