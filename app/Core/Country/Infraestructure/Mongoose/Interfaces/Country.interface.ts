import { Document } from '@ioc:Mongoose'
import { UnitMeasureSystemEnum } from 'App/Core/Country/Infraestructure/enums/UnitMeasureSystemEnum'

interface Languages {
  iso639_1: string
  iso639_2: string
  name: string
  nativeName: string
}

export interface Country {
  name: string
  alpha3Code: string
  languages: Languages[]
}

export interface UnitMeasureSystem {
  type: string
  enum: UnitMeasureSystemEnum
  default: UnitMeasureSystemEnum.METRIC
}

export type CountryDocument = Country & Document
