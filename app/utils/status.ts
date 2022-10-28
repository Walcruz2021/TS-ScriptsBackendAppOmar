const getStatus = (name) => {
  const statusActivities = [
    {
      es: 'COMPLETAR',
      en: 'TO_COMPLETE'
    },
    {
      es: 'PLANIFICADA',
      en: 'PLANNED'
    },
    {
      es: 'REALIZADA',
      en: 'DONE'
    },
    {
      es: 'TERMINADA',
      en: 'FINISHED'
    }
  ]

  return statusActivities.find((item) => item.en === name)
}

export const statusActivities = (name) => {
  return [
    {
      name: getStatus(name)
    }
  ]
}

export const cropStatusActivities: Array<any> = [
  {
    name: 'TO_COMPLETE',
    cropStatus: 'pending'
  },
  {
    name: 'PLANNED',
    cropStatus: 'toMake'
  },
  {
    name: 'DONE',
    cropStatus: 'done'
  },
  {
    name: 'FINISHED',
    cropStatus: 'finished'
  },
  {
    name: 'EXPIRED',
    cropStatus: 'toMake'
  }
]
