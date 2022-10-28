import { Schema } from '@ioc:Mongoose'
import {
  EOperationTypeDataBase,
  IEntity
} from '../Interfaces/EventsAuditEntities.interface'

export const EventsAuditEntitiesSchema: Schema = new Schema(
  {
    documentKey: {
      type: String,
      required: true
    },
    entity: {
      type: String,
      enum: Object.values(IEntity),
      required: true
    },
    operationType: {
      type: String,
      enum: Object.values(EOperationTypeDataBase),
      required: true
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      require: true
    }
  },
  { timestamps: true }
)
