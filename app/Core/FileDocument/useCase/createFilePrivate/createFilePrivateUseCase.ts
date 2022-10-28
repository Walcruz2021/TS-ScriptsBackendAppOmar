import {
  FileUrlDTO,
  CreateFileSyncDTO,
  IFileProps
} from '../../Infrastructure/Mongoose/Interfaces/FileDocument.interface'
import Env from '@ioc:Adonis/Core/Env'
import { createReadStreamUtil, formDataAppend } from 'App/utils/utils'
import { Either, left, Result, right } from 'App/Core/utils/Result'
import { GenericAppError } from 'App/Core/utils/AppError'
import { FileErrors } from '../FileErrors'

type Response = Either<
  GenericAppError.UnexpectedError | FileErrors.FileInvalid | Result<any>,
  Result<void | IFileProps>
>

export class CreateFilePrivateUseCase {
  constructor(private entityRepo) {}

  public async execute(fileUrlDTO: FileUrlDTO): Promise<Response> {
    const { filePath, entityId, directory } = fileUrlDTO
    let entity: IFileProps
    try {
      const msFilesUrl = Env.get('MS_FILES_URL')
      const url = `${msFilesUrl}/v1/files/private?directory=${directory}&entityId=${entityId}`
      const form = formDataAppend('file', createReadStreamUtil(filePath))
      const formHeaders = form.getHeaders()
      const dto = {
        url,
        body: form,
        headers: {
          ...formHeaders
        }
      } as CreateFileSyncDTO
      entity = await this.entityRepo.saveSync(dto)
    } catch (err) {
      console.log('CreateFilePrivateUseCase MS FILES: Err')
      console.log(err)
      return left(new FileErrors.FileInvalid(err)) as Response
    }

    return right(
      Result.ok<IFileProps>({
        ...entity,
        url: entity.path,
        fileKey: entity.key
      })
    ) as Response
  }
}
