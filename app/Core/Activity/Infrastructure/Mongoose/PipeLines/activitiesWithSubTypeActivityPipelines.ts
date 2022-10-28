const lookupSubTypeActivities = {
  from: 'subtypeactivities',
  let: { subTypeActivityId: '$subTypeActivity' },
  pipeline: [
    {
      $match: {
        $expr: { $eq: ['$_id', '$$subTypeActivityId'] }
      }
    },
    {
      $project: {
        _id: 1,
        keySubTypesActivity: '$key'
      }
    }
  ],
  as: 'subTypeActivity'
}
const lookupAchievements = {
  from: 'achievements',
  let: { achievementId: '$achievements' },
  pipeline: [
    {
      $match: {
        $expr: { $eq: ['$_id', '$$achievementId'] },
        subTypeActivity: null
      }
    },
    {
      $project: {
        _id: 1
      }
    }
  ],
  as: 'achievement'
}
const activitiesWithSubTypeActivityPipelines = [
  {
    $match: {
      subTypeActivity: { $ne: null }
    }
  },
  {
    $unwind: '$achievements'
  },
  {
    $lookup: lookupAchievements
  },
  {
    $unwind: '$achievement'
  },
  {
    $group: {
      _id: '$_id',
      achievements: { $push: '$achievement' },
      subTypeActivity: { $first: '$subTypeActivity' }
    }
  },
  {
    $lookup: lookupSubTypeActivities
  },
  {
    $unwind: '$subTypeActivity'
  }
]

const countActivitiesWithSubTypeActivityPipelines = [
  ...activitiesWithSubTypeActivityPipelines,
  ...[
    {
      $count: 'totals'
    }
  ]
]
export {
  activitiesWithSubTypeActivityPipelines,
  countActivitiesWithSubTypeActivityPipelines
}
