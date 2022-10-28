import axios from 'axios'

import Env from '@ioc:Adonis/Core/Env'

export const sendLegacyLotData = async (uuid: string) => {
  return await axios.request({
    headers: {},
    method: 'PUT',
    url: `${Env.get('MS_FARM_URL')}/v1/fields/${uuid}/legacy/centroid`
  })
}
