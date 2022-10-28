import { Schema } from '@ioc:Mongoose'

export const FileDocumentSchema: Schema = new Schema(
  {
    nameFile: {
      type: String
    },
    name: {
      type: String
    },
    description: {
      type: String
    },
    key: {
      type: String
    },
    path: {
      type: String
    },
    keyIntermediate: {
      type: String
    },
    pathIntermediate: {
      type: String
    },
    keyThumbnails: {
      type: String
    },
    pathThumbnails: {
      type: String
    },
    codeMd5: {
      type: String
    },
    mimetype: {
      type: String
    },
    size: {
      type: Number
    },
    pathServer: {
      type: String
    },
    existsPath: {
      type: Boolean
    },
    isPrivate: {
      type: Boolean
    },
    evidenceConcept: {
      type: Schema.Types.ObjectId,
      ref: 'EvidenceConcept'
    }
  },
  { timestamps: true }
)

const fileSchema = new Schema({
  url: {
    type: String
  },
  fileKey: {
    type: String
  }
})

export default fileSchema
