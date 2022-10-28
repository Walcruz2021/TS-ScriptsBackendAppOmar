import Flag from '../Models/Flag'
import { FlagRepository as FlagRepo } from './FlagRepository'

const FlagRepository = new FlagRepo(Flag)

export { FlagRepository }
