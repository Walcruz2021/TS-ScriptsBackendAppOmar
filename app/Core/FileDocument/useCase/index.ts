import FileDocumentRepository from '../Infrastructure/Mongoose/Repositories'
import { CreateFileUseCase } from './createFile/createFileUseCase'
import { CreateFilePrivateUseCase } from './createFilePrivate/createFilePrivateUseCase'
import { GetFileUseCase } from './getFile/getFileUseCase'

const createFileUseCase = new CreateFileUseCase(FileDocumentRepository)
const createFilePrivateUseCase = new CreateFilePrivateUseCase(
  FileDocumentRepository
)
const getFileUseCase = new GetFileUseCase(FileDocumentRepository)

export { createFileUseCase, createFilePrivateUseCase, getFileUseCase }
