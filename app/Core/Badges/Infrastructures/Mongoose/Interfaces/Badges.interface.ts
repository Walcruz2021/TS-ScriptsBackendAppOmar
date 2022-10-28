import { Document } from '@ioc:Mongoose'
import { BadgeTypes } from '../Enums'
export interface Badge {
  _id: string
  type: BadgeTypes
  name: {
    es: string
    en: string
    pt: string
  }
  goalReach: number
  image: string
}

export type BadgeDocument = Badge & Document
