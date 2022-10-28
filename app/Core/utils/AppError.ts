import { Result } from './Result'
import { UseCaseError } from './UseCaseError'
export namespace GenericAppError {
  export class UnexpectedError extends Result<UseCaseError> {
    constructor(err: any) {
      console.log(`[AppError]: An unexpected error occurred`)
      console.error(err)
      super(false, {
        message: err ? err.toString() : `An unexpected error occurred.`,
        code: 'ERROR_SERVER'
      } as UseCaseError)
    }

    public static create(err: any): UnexpectedError {
      return new UnexpectedError(err)
    }
  }
}
