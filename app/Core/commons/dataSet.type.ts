// eslint-disable-next-line @typescript-eslint/naming-convention
export type dataSetToUpdateType = Record<string, any>

// eslint-disable-next-line @typescript-eslint/naming-convention
export type dataWithSetType = {
  $set: dataSetToUpdateType
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export type dataWithUnSetType = {
  $unSet: dataSetToUpdateType
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export type dataSetType =
  | dataSetToUpdateType
  | dataWithSetType
  | dataWithUnSetType
