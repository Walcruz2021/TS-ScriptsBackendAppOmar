const getLotWithAreaPipelines = [
  {
    $match: {
      $expr: {
        $eq: [{ $isArray: '$area' }, true]
      }
    }
  },
  {
    $redact: {
      $cond: {
        if: {
          $gt: [
            {
              $size: ['$area']
            },
            0
          ]
        },
        then: '$$KEEP',
        else: '$$PRUNE'
      }
    }
  }
]

const countLotWithAreaPipelines = [
  {
    $match: {
      $expr: {
        $eq: [{ $isArray: '$area' }, true]
      }
    }
  },
  {
    $redact: {
      $cond: {
        if: {
          $gt: [
            {
              $size: ['$area']
            },
            0
          ]
        },
        then: '$$KEEP',
        else: '$$PRUNE'
      }
    }
  },
  { $count: 'totals' }
]

export { getLotWithAreaPipelines, countLotWithAreaPipelines }
