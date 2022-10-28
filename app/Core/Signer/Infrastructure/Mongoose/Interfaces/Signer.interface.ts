export interface Signer {
  _id?: string
  signed: boolean
  userId: string
  fullName: string
  email: string
  type: string
  dateSigned?: Date
}
