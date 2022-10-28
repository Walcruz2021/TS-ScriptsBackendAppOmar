import { Schema } from '@ioc:Mongoose'

const imageType = new Schema({
  file: {
    type: Schema.Types.ObjectId,
    ref: 'FileDocument'
  },
  normal: {
    type: String
  }
})

export const FarmSchema: Schema = new Schema(
  {
    uuid: {
      type: String,
      require: true
    },
    name: {
      type: String,
      require: true
    },
    surface: {
      type: Number,
      require: true
    },
    geometryData: {
      type: Schema.Types.Mixed,
      require: true
    },
    countryName: {
      type: String
    },
    provinceName: {
      type: String
    },
    cityName: {
      type: String
    },
    image: {
      type: imageType,
      default: null
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: 'Company'
    }
  },
  {
    toJSON: {
      virtuals: true
    },
    toObject: {
      virtuals: true
    },
    timestamps: true
  }
)
