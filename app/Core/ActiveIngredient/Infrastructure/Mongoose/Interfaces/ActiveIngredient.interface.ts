import { Document } from '@ioc:Mongoose'

export interface ActiveIngredient {
  _id?: string
  name: { es?: string; en?: string; pt?: string }
  eiq: number | string | any
}

export interface ActiveIngredientUnified {
  active_principle: string
  active_ingredient_unified: string
  eiq: string
}

export const collectionName = 'ActiveIngredient'

export type ActiveIngredientDocument = ActiveIngredient & Document
