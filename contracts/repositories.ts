/*
 * RolRepository module
 */
declare module '@ioc:Ucropit/Core/RolRepository' {
  import { RolRepositoryContract } from 'App/Core/Rol/Infrastructure/Contracts'
  const RolRepository: RolRepositoryContract
  export default RolRepository
}

/*
 * CropRepository module
 */
declare module '@ioc:Ucropit/Core/CropRepository' {
  import { CropRepositoryContract } from 'App/Core/Crop/Infrastructure/Contracts'
  const CropRepository: CropRepositoryContract
  export default CropRepository
}

/*
 * AchievementRepository module
 */
declare module '@ioc:Ucropit/Core/AchievementRepository' {
  import { AchievementRepositoryContract } from 'App/Core/Achievement/Infrastructure/Contracts'
  const AchievementRepository: AchievementRepositoryContract
  export default AchievementRepository
}

/*
 * ActivityRepository module
 */
declare module '@ioc:Ucropit/Core/ActivityRepository' {
  import { ActivityRepositoryContract } from 'App/Core/Activity/Infrastructure/Contracts'
  const ActivityRepository: ActivityRepositoryContract
  export default ActivityRepository
}

/*
 * Storage module
 */
declare module '@ioc:Ucropit/Core/StorageRepository' {
  import { StorageContract } from 'App/Core/Storage/Contracts'
  const StorageRepository: StorageContract
  export default StorageRepository
}

/*
 * Supply module
 */
declare module '@ioc:Ucropit/Core/SupplyRepository' {
  import { SupplyRepositoryContract } from 'App/Core/Supply/Infrastructure/Contracts'
  const SupplyRepository: SupplyRepositoryContract
  export default SupplyRepository
}
/*
 * SupplyType module
 */
declare module '@ioc:Ucropit/Core/SupplyTypeRepository' {
  import { SupplyTypeRepositoryContract } from 'App/Core/SupplyType/Infrastructure/Contracts'
  const SupplyTypeRepository: SupplyTypeRepositoryContract
  export default SupplyTypeRepository
}

/*
 * CollectionVersion module
 */
declare module '@ioc:Ucropit/Core/CollectionVersionRepository' {
  import { CollectionVersionRepositoryContract } from 'App/Core/CollectionVersion/Infrastructure/Contracts'
  const CollectionVersionRepository: CollectionVersionRepositoryContract
  export default CollectionVersionRepository
}

/*
 * Farm module
 */
declare module '@ioc:Ucropit/Core/FarmRepository' {
  import { FarmRepositoryContract } from 'App/Core/Farm/Infrastructure/Contracts'
  const FarmRepository: FarmRepositoryContract
  export default FarmRepository
}
