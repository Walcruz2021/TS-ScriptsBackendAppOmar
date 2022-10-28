import { Schema } from '@ioc:Mongoose'
import mongooseLeanVirtuals from 'mongoose-lean-virtuals'
import CollectionVersionRepository from '../../../../CollectionVersion/Infrastructure/Mongoose/Repositories'
import { collectionName } from '../Interfaces'
import { ICollectionVersion } from 'App/Core/CollectionVersion/Infrastructure/Mongoose/Interfaces'

export const SupplySchema: Schema = new Schema(
  {
    alphaCode: {
      type: String,
      default: 'ARG',
      require: true
    },
    supplyType: {
      type: String,
      require: true
    },
    typeId: {
      type: Schema.Types.ObjectId,
      ref: 'SupplyType'
    },
    unitTypeSupply: {
      type: Schema.Types.ObjectId,
      ref: 'UnitTypeSupply'
    },
    countryId: {
      type: Schema.Types.ObjectId,
      ref: 'Country',
      require: true
    },
    name: String,
    company: String,
    code: String,
    unit: String,
    brand: String,
    compositon: String,
    classToxic: String,
    createdAt: Date,
    updatedAt: Date,
    activeIngredients: [
      {
        activeIngredient: {
          type: Schema.Types.ObjectId,
          ref: 'ActiveIngredient'
        },
        eiqActiveIngredient: {
          type: Number
        },
        eiq: {
          type: Number
        },
        composition: {
          type: Number
        }
      }
    ]
  },
  { timestamps: true }
)

SupplySchema.index({ alphaCode: 1 }, { background: true })
SupplySchema.index({ supplyType: 1 }, { background: true })
SupplySchema.index({
  alphaCode: 'text',
  name: 'text',
  brand: 'text',
  company: 'text'
})

SupplySchema.virtual('eiqTotal').get(function () {
  if (this.activeIngredients) {
    return this.activeIngredients.reduce(
      (prev, next) => prev + (next['eiq'] || 0),
      0
    )
  }
  return undefined
})
SupplySchema.plugin(mongooseLeanVirtuals)

// After update events
SupplySchema.post(
  // @ts-ignore
  ['save', 'insertMany', 'update', 'updateOne', 'findOneAndUpdate'],
  function () {
    const setData: ICollectionVersion = {
      collectionName: collectionName,
      versionDate: new Date()
    }
    CollectionVersionRepository.createOrUpdate(setData).then()
  }
)
