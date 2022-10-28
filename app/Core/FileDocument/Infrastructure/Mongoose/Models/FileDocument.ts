import { model } from '@ioc:Mongoose'
import { FileDocumentSchema } from '../Schemas/FileDocument'
import { FileDocDocument } from 'App/Core/FileDocument/Infrastructure/Mongoose/Interfaces'

export default model<FileDocDocument>('FileDocument', FileDocumentSchema)
