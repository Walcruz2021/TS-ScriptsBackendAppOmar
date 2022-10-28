import { Schema } from '@ioc:Mongoose'
import { UnitMeasureSystemEnum } from 'App/Core/Country/Infraestructure/enums/UnitMeasureSystemEnum'

export const CountrySchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    phoneCode: {
      type: String,
      default: ''
    },
    capital: {
      type: String,
      default: ''
    },
    geolocation: {
      type: Object,
      default: []
    },
    timezone: {
      type: String,
      default: ''
    },
    currencies: [
      {
        code: {
          type: String,
          default: ''
        },
        name: {
          type: String,
          default: ''
        },
        symbol: {
          type: String,
          default: ''
        }
      }
    ],
    languages: [
      {
        iso639_1: {
          type: String,
          default: ''
        },
        iso639_2: {
          type: String,
          default: ''
        },
        name: {
          type: String,
          default: ''
        },
        nativeName: {
          type: String,
          default: ''
        }
      }
    ],
    flag: {
      type: String,
      required: true
    },
    alpha2Code: {
      type: String,
      required: true
    },
    alpha3Code: {
      type: String,
      required: true
    },
    disabled: {
      type: Boolean,
      required: true
    },
    unitMeasureSystem: {
      type: String,
      default: UnitMeasureSystemEnum.METRIC
    },
    createdAt: Date,
    updatedAt: Date
  },
  { timestamps: true }
)
