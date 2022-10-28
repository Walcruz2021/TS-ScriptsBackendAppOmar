import { Schema } from '@ioc:Mongoose'
import { CompanyEnum } from '../../../enums/Company.enum'
import { UnitMeasureSystemEnum } from '../../../enums/UnitMeasureSystem.enum'
import { UserContactEnum } from 'App/Core/User/enums/Company.enum'
import CompanyType from 'App/Core/CompanyType/Infrastructure/Mongoose/Models/CompanyType'
import Country from 'App/Core/Country/Infraestructure/Mongoose/Models/Country'

export const CompanySchema: Schema = new Schema(
  {
    identifier: {
      type: String,
      require: true,
      unique: true
    },
    typePerson: {
      type: String,
      enum: Object.values(CompanyEnum),
      default: CompanyEnum.PHYSICAL_PERSON
    },
    unitMeasureSystem: {
      type: String,
      enum: Object.values(UnitMeasureSystemEnum),
      default: UnitMeasureSystemEnum.METRIC
    },
    name: {
      type: String,
      require: true
    },
    address: {
      type: String,
      require: true
    },
    addressFloor: {
      type: String,
      require: false
    },
    status: {
      type: Boolean,
      default: false
    },
    files: {
      type: [{ type: Schema.Types.ObjectId }]
    },
    users: [
      {
        isAdmin: {
          type: Boolean,
          default: false
        },
        isResponsible: {
          type: Boolean,
          default: false
        },
        isDataEntry: {
          type: Boolean,
          default: false
        },
        user: {
          type: Schema.Types.ObjectId,
          ref: 'User'
        },
        role: {
          type: Schema.Types.ObjectId,
          ref: 'Role'
        }
      }
    ],
    collaborators: [
      {
        isAdmin: {
          type: Boolean,
          default: false
        },
        isResponsible: {
          type: Boolean,
          default: false
        },
        user: {
          type: Schema.Types.ObjectId,
          ref: 'User'
        },
        role: {
          type: Schema.Types.ObjectId,
          ref: 'Role'
        },
        company: {
          type: Schema.Types.ObjectId,
          ref: 'Company'
        },
        identifier: {
          type: String
        }
      }
    ],
    servicesIntegrations: [
      {
        service: {
          type: String
        },
        integrate: {
          type: Boolean,
          default: true
        }
      }
    ],
    contacts: [
      {
        type: {
          type: String,
          default: UserContactEnum.CONTACT_REPRESENTATIVE
        },
        user: { type: Schema.Types.ObjectId }
      }
    ],
    country: {
      type: Schema.Types.ObjectId,
      ref: Country
    },
    types: {
      type: [{ type: Schema.Types.ObjectId }],
      ref: CompanyType
    },
    createdAt: Date,
    updatedAt: Date
  },
  {
    timestamps: true
  }
)
