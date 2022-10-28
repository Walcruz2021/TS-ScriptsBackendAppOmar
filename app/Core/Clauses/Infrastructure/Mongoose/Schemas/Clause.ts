import { Schema } from '@ioc:Mongoose'
import fileSchema from 'App/Core/FileDocument/Infrastructure/Mongoose/Schemas/FileDocument'

export const ClauseSchema: Schema = new Schema(
  {
    id: { type: String },
    title: { type: String, require: true },
    slug: { type: String },
    description: { type: String },
    imageOriginal: { type: fileSchema, default: null },
    imageIntermediate: { type: fileSchema, default: null },
    imageThumbnail: { type: fileSchema, default: null },
    id_clause: { type: Number, min: 1, unique: true }
  },
  { timestamps: true }
)
