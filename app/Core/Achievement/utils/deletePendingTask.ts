import Env from '@ioc:Adonis/Core/Env'
import axios from 'axios'

export const deletePendingTask = async (data): Promise<any> => {
  const msFilesUrl = Env.get('MS_PENDING_TASK_URL')
  const url = `${msFilesUrl}/v1/pendingTask/`
  return axios
    .delete(url, { data: { pendingTaskIds: data } })
    .then((res) => {
      return res.data
    })
    .catch((err) => {
      console.error(err)
      return false
    })
}
