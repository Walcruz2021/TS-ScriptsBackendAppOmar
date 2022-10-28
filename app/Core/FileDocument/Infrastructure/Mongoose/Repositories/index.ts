import FileDocument from 'App/Core/FileDocument/Infrastructure/Mongoose/Models/FileDocument'
import FileDocumentRepo from 'App/Core/FileDocument/Infrastructure/Mongoose/Repositories/FileDocumentRepository'

const FileDocumentRepository = new FileDocumentRepo(FileDocument)
export default FileDocumentRepository
