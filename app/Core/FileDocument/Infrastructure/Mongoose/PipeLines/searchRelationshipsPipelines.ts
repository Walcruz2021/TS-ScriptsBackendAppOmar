const commonPipelineFiles = [
  {
    $redact: {
      $cond: {
        if: {
          $gt: [
            {
              $size: ['$files']
            },
            0
          ]
        },
        then: '$$KEEP',
        else: '$$PRUNE'
      }
    }
  },
  {
    $unwind: '$files'
  },
  {
    $match: {
      $expr: { $eq: ['$files', '$$fileId'] }
    }
  },
  {
    $project: {
      _id: 1
    }
  }
]

const lookupCompanies = {
  from: 'companies',
  let: { fileId: '$_id' },
  pipeline: commonPipelineFiles,
  as: 'company'
}
const lookupActivities = {
  from: 'activities',
  let: { fileId: '$_id' },
  pipeline: commonPipelineFiles,
  as: 'activity'
}
const lookupAchievements = {
  from: 'achievements',
  let: { fileId: '$_id' },
  pipeline: commonPipelineFiles,
  as: 'achievement'
}
const lookupCrops = {
  from: 'crops',
  let: { cropId: '$cropId' },
  pipeline: [
    {
      $match: {
        $expr: { $eq: ['$_id', '$$cropId'] }
      }
    },
    {
      $project: {
        _id: 1
      }
    }
  ],
  as: 'crop'
}
const lookupApprovalregisterSignsPdf = {
  from: 'approvalregistersigns',
  let: { fileId: '$_id' },
  pipeline: [
    {
      $match: {
        $expr: { $eq: ['$filePdf', '$$fileId'] }
      }
    },
    {
      $project: {
        _id: 1
      }
    }
  ],
  as: 'approvalRegisterSignPdf'
}
const lookupApprovalregisterSignsOts = {
  from: 'approvalregistersigns',
  let: { fileId: '$_id' },
  pipeline: [
    {
      $match: {
        $expr: { $eq: ['$fileOts', '$$fileId'] }
      }
    },
    {
      $project: {
        _id: 1
      }
    }
  ],
  as: 'approvalRegisterSignOts'
}
const searchRelationshipsPipelines = [
  {
    $match: {
      key: null
    }
  },
  {
    $lookup: lookupCompanies
  },
  {
    $unwind: {
      path: '$company',
      preserveNullAndEmptyArrays: true
    }
  },
  {
    $lookup: lookupActivities
  },
  {
    $unwind: {
      path: '$activity',
      preserveNullAndEmptyArrays: true
    }
  },
  {
    $lookup: lookupAchievements
  },
  {
    $unwind: {
      path: '$achievement',
      preserveNullAndEmptyArrays: true
    }
  },
  {
    $lookup: lookupCrops
  },
  {
    $unwind: {
      path: '$crop',
      preserveNullAndEmptyArrays: true
    }
  },
  {
    $lookup: lookupApprovalregisterSignsPdf
  },
  {
    $unwind: {
      path: '$approvalRegisterSignPdf',
      preserveNullAndEmptyArrays: true
    }
  },
  {
    $lookup: lookupApprovalregisterSignsOts
  },
  {
    $unwind: {
      path: '$approvalRegisterSignOts',
      preserveNullAndEmptyArrays: true
    }
  }
]

const countRelationshipsPipelines = [
  {
    $match: {
      key: null
    }
  },
  { $count: 'totals' }
]
export { searchRelationshipsPipelines, countRelationshipsPipelines }
