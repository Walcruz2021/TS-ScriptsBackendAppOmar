import {
  createFilePrivateUseCase,
  createFileUseCase
} from 'App/Core/FileDocument/useCase'
import ImageService from './images/ImageService'
import { generateDirRandom, rmdirSyncUtil } from './utils'

export const uploadImages = async (entityId, directory, fileName, filePath) => {
  const results = {
    error: null,
    imageOriginal: null,
    imageIntermediate: null,
    imageThumbnail: null
  }
  const destination = generateDirRandom()

  const files = await ImageService.resizeAsync(
    filePath,
    fileName,
    destination,
    300,
    300
  )
  let fileResponse = await createFileUseCase.execute({
    filePath: files.original,
    directory,
    entityId
  })

  let file = fileResponse.value

  if (fileResponse.isRight()) {
    results.imageOriginal = file.getValue()
  }

  fileResponse = await createFileUseCase.execute({
    filePath: files.intermediate,
    directory,
    entityId
  })

  file = fileResponse.value

  if (fileResponse.isRight()) {
    results.imageIntermediate = file.getValue()
  }

  fileResponse = await createFileUseCase.execute({
    filePath: files.thumbnail,
    directory,
    entityId
  })

  file = fileResponse.value

  if (fileResponse.isRight()) {
    results.imageThumbnail = file.getValue()
  }

  rmdirSyncUtil(destination)
  return results
}

export const uploadFromS3Images = async (
  entityId,
  directory,
  fileName,
  inputBuffer
) => {
  let results: any
  const destination = generateDirRandom()

  const files = await ImageService.resizeAsyncImageFromS3(
    inputBuffer,
    fileName,
    destination,
    300,
    300
  )
  let fileResponse = await createFileUseCase.execute({
    filePath: files.original,
    directory,
    entityId
  })

  let file = fileResponse.value

  if (fileResponse.isRight()) {
    results.imageOriginal = file.getValue()
  }

  fileResponse = await createFileUseCase.execute({
    filePath: files.intermediate,
    directory,
    entityId
  })

  file = fileResponse.value

  if (fileResponse.isRight()) {
    results.imageIntermediate = file.getValue()
  }

  fileResponse = await createFileUseCase.execute({
    filePath: files.thumbnail,
    directory,
    entityId
  })

  file = fileResponse.value

  if (fileResponse.isRight()) {
    results.imageThumbnail = file.getValue()
  }

  rmdirSyncUtil(destination)
  return results
}

export const uploadTemplate = async (entityId, directory, filePath) => {
  let error = null
  let termsAndConditionsTemplate = null
  const fileResponse = await createFilePrivateUseCase.execute({
    filePath,
    directory,
    entityId
  })

  const file = fileResponse.value

  if (fileResponse.isRight()) {
    termsAndConditionsTemplate = file.getValue()
  } else {
    error = file.getValue().message
  }

  return {
    error,
    termsAndConditionsTemplate
  }
}
