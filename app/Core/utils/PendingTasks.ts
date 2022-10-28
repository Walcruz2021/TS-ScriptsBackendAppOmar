import axios from 'axios'

import Env from '@ioc:Adonis/Core/Env'

let pendingTasksIds: any = []

export const sendLegacyPendingTasks = async (sliceIndex, data) => {
  const dataToSend = data.slice(sliceIndex, sliceIndex + 250)

  if (dataToSend.length === 0) {
    const dataToReturn = pendingTasksIds

    pendingTasksIds = []

    return dataToReturn
  }

  let pendingTasksCreated = []
  let statusResponse

  try {
    const { data, status } = await axios.request({
      headers: {},
      method: 'POST',
      url: `${Env.get('MS_PENDING_TASK_URL')}/v1/pendingTask`,
      data: dataToSend
    })

    pendingTasksCreated = data

    statusResponse = status
  } catch (error) {
    console.error(error)

    console.error(
      `ERROR CREATING: ${sliceIndex} - ${sliceIndex + dataToSend.length}`
    )
  }

  if (statusResponse === 200 && pendingTasksCreated?.length) {
    console.log(`CREATED: ${sliceIndex} - ${sliceIndex + dataToSend.length}`)

    pendingTasksIds = [
      ...pendingTasksIds,
      ...pendingTasksCreated.filter((element) => element)
    ]
  } else {
    console.error(
      `ERROR CREATING: ${sliceIndex} - ${sliceIndex + dataToSend.length}`
    )
  }

  return await sendLegacyPendingTasks(sliceIndex + 250, data)
}
