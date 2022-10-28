import { model } from '@ioc:Mongoose'
import { RolSchema } from '../Schemas/Rol'
import { RolesDocument } from '../../Interfaces'

export default model<RolesDocument>('Role', RolSchema)
