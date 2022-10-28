import Application from '@ioc:Adonis/Core/Application'
import FileStorage from 'App/Core/Storage/File/FileStorage'
import FileStorageRepo from 'App/Core/Storage/File/FileStorageRepository'

const InstanceFileStorage = new FileStorage(Application.tmpPath())
const FileStorageRepository = new FileStorageRepo(InstanceFileStorage)
export default FileStorageRepository
