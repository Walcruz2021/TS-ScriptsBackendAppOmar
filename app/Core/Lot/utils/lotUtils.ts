import * as turf from '@turf/turf'
import { lineToPolygon, Feature, Position } from '@turf/turf'
import axios from 'axios'
import Env from '@ioc:Adonis/Core/Env'

export const generatePolygon = (name = '', area: Position[]): Feature => {
  const lineString = turf.lineString(area, { name })
  const polygon = lineToPolygon(lineString)
  return polygon
}

export const updateLots = async (idLots): Promise<Boolean> => {
  const msFilesUrl = Env.get('MS_FARM_URL')
  const url = `${msFilesUrl}/v1/fields/status?timestamps=false`
  return axios
    .patch(url, idLots)
    .then((res) => {
      const { status } = res
      return status === 200
    })
    .catch((err) => {
      console.error(err)
      return false
    })
}
