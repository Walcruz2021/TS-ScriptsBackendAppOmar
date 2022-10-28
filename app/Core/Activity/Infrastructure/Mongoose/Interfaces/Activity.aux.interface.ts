// eslint-disable-next-line @typescript-eslint/naming-convention
export interface IActivityHarvest {
  _id: string
  dateHarvest?: Date
  type: object
  lots: string[]
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface IValidateLotInActivityHarvest {
  activities: IActivityHarvest[]
  lotId: string
  currentDate: Date
  dateHarvest: Date
}
