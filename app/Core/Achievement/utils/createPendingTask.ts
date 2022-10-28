import Env from '@ioc:Adonis/Core/Env'
import axios from 'axios'

export const createPendingTask = async (data): Promise<any> => {
  const msFilesUrl = Env.get('MS_PENDING_TASK_URL')
  const url = `${msFilesUrl}/v1/pendingTask/`
  return axios
    .post(url, data)
    .then((res) => {
      return res.data
    })
    .catch((err) => {
      console.error(err)
      return false
    })
}
