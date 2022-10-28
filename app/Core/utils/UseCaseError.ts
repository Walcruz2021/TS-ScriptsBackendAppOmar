interface IUseCaseErrorError {
  message: string
}

export abstract class UseCaseError implements IUseCaseErrorError {
  public readonly message: string
  public readonly code: string

  constructor(message: string, code: string) {
    this.message = message
    this.code = code
  }
}
