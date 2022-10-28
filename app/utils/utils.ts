const rimraf = require('rimraf')
import { v4 as uuid } from 'uuid'
import { deburr } from 'lodash'
import FormData from 'form-data'
import { Types } from 'mongoose'
import {
  createReadStream,
  createWriteStream,
  existsSync,
  mkdirSync,
  writeFile,
  writeFileSync,
  readFileSync,
  unlinkSync
} from 'fs'

export function renameProp(
  oldProp: string,
  newProp: string,
  { [oldProp]: old, ...others }
) {
  return {
    [newProp]: old,
    ...others
  }
}

// export const parseUrlImageDefault = (raw, key, imagePath) => {
//   if (raw[key]) {
//     return raw[key].url
//   }
//   return `${config.baseUrl}/images/${imagePath}`
// }

// export const parseTemplateDefault = (raw, key, imagePath) => {
//   if (raw[key]) {
//     return raw[key].url
//   }
//   return `${config.baseUrl}/images/${imagePath}`
// }
export const ObjectId = (id) => new Types.ObjectId(id)

export const createDirSync = (path) => {
  let pathRoot = process.cwd()
  const dirParts = path.split('/')
  dirParts.shift()
  dirParts.forEach((pathName) => {
    pathRoot = `${pathRoot}/${pathName}`
    if (!existsSync(pathRoot)) {
      mkdirSync(pathRoot)
    }
  })
  return pathRoot
}

export const createWriteStreamUtil = (filePath) => createWriteStream(filePath)

export const readFileSyncUtil = (filePath) => readFileSync(filePath)

export const mkdirSyncUtil = (filePath) => mkdirSync(filePath)

export const writeFileSyncUtil = (filePath, inputBuffer) =>
  writeFileSync(filePath, inputBuffer)
export const writeFileAsyncUtil = (filePath, inputBuffer) => {
  return new Promise((resolve, reject) => {
    writeFile(filePath, inputBuffer, (err) => {
      if (err) {
        return reject(err)
      }
      resolve(true)
    })
  })
}

export const existsSyncUtil = (filePath) => existsSync(filePath)

export const unlinkSyncUtil = (filePath) => unlinkSync(filePath)

export const createReadStreamUtil = (filePath) => createReadStream(filePath)

export const generateDirRandom = () => {
  const dir = createDirSync(`/tmp/${uuid()}`)
  return dir
}

export const rmdirSyncUtil = (path) => {
  rimraf(path, (err) => {
    if (err) {
      console.log('rmdirSyncUtil')
      console.log(err)
    }
  })
}

export const generateArrayPercentage = (
  value: string,
  len: number,
  arrayList?: string[]
) => {
  if (arrayList) {
    for (let i = 0; i < len; i++) {
      arrayList[i] = value
    }
  } else {
    arrayList = []

    for (let i = 0; i < len; i++) {
      arrayList.push(value)
    }
  }

  return arrayList
}

export const generateSlug = (name) =>
  deburr(name).toLowerCase().replace(/\s+/g, '').toString()

export const createDirTmpSync = () => {
  const patch = `${process.cwd()}/tmp`
  if (!existsSyncUtil(patch)) {
    mkdirSyncUtil(patch)
  }
}

export const formDataAppend = (filename, file) => {
  const form = new FormData()
  form.append(filename, file)
  return form
}

export const objectIdPattern = () => {
  return /^[0-9a-fA-F]{24}$/
}
