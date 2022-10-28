import { Schema } from '@ioc:Mongoose'
import mongooseLeanVirtuals from 'mongoose-lean-virtuals'
import wkx from 'wkx'
const file = new Schema({
  file: {
    type: Schema.Types.ObjectId,
    ref: 'FileDocument'
  },
  normal: {
    type: String
  },
  normalLegacy: {
    type: String
  }
})
export const LotSchema: Schema = new Schema(
  {
    name: {
      type: String,
      require: true
    },
    image: {
      type: file,
      default: null
    },
    area: {
      type: Schema.Types.Mixed,
      default: null
    },
    surface: {
      type: Number,
      require: true
    },
    uuid: {
      type: String
    },
    geometryData: {
      type: Schema.Types.Mixed
    },
    centerBound: {
      type: Schema.Types.Mixed
    },
    farm: {
      type: Schema.Types.ObjectId,
      ref: 'Farm'
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

LotSchema.virtual('wktFormat').get(function () {
  if (this.geometryData) {
    const geometry = wkx.Geometry.parseGeoJSON(this.geometryData)
    return geometry.toEwkt()
  }
})

LotSchema.plugin(mongooseLeanVirtuals)
