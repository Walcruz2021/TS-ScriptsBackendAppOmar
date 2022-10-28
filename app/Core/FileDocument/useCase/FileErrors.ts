import { Result } from 'App/Core/utils/Result'
import { UseCaseError } from 'App/Core/utils/UseCaseError'

export namespace FileErrors {
  export class FileInvalid extends Result<UseCaseError> {
    constructor(err: any) {
      super(false, {
        message: err.message ? err.message : 'File name is invalid '
      } as UseCaseError)
    }
  }
}
