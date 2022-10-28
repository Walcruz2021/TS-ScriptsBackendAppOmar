import { Schema } from '@ioc:Mongoose'
import { CompanyTypeEnum } from '../../enums/CompanyType.enum'

export const CompanyTypeSchema: Schema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      enum: Object.values(CompanyTypeEnum)
    }
  },
  {
    timestamps: true
  }
)
