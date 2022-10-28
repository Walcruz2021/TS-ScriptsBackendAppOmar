import Application, { ApplicationContract } from '@ioc:Adonis/Core/Application'
export default class AppProvider {
  constructor(protected app: ApplicationContract) {}

  public async register() {
    // Register your own bindings

    //Register Module Rol
    const { default: Rol } = await import(
      'App/Core/Rol/Infrastructure/Mongoose/Models/Rol'
    )
    const { default: RolRepository } = await import(
      'App/Core/Rol/Infrastructure/Mongoose/Repositories/RolRepository'
    )
    //Register Module Crop
    const { default: Crop } = await import(
      'App/Core/Crop/Infrastructure/Mongoose/Models/Crop'
    )
    const { default: CropRepository } = await import(
      'App/Core/Crop/Infrastructure/Mongoose/Repositories/CropRepository'
    )

    //Register Module Achievement
    const { default: Achievement } = await import(
      'App/Core/Achievement/Infrastructure/Mongoose/Models/Achievement'
    )
    const { default: AchievementRepository } = await import(
      'App/Core/Achievement/Infrastructure/Mongoose/Repositories/AchievementRepository'
    )

    //Register Module FileDocument
    const { default: FileDocument } = await import(
      'App/Core/FileDocument/Infrastructure/Mongoose/Models/FileDocument'
    )
    const { default: FileDocumentRepository } = await import(
      'App/Core/FileDocument/Infrastructure/Mongoose/Repositories/FileDocumentRepository'
    )
    //Register Module Activity
    const { default: Activity } = await import(
      'App/Core/Activity/Infrastructure/Mongoose/Models/Activity'
    )
    const { default: ActivityRepository } = await import(
      'App/Core/Activity/Infrastructure/Mongoose/Repositories/ActivityRepository'
    )

    const { default: FileStorage } = await import(
      'App/Core/Storage/File/FileStorage'
    )
    const { default: FileStorageRepository } = await import(
      'App/Core/Storage/File/FileStorageRepository'
    )

    //Register Module Supply
    const { default: Supply } = await import(
      'App/Core/Supply/Infrastructure/Mongoose/Models/Supply'
    )
    const { default: SupplyRepository } = await import(
      'App/Core/Supply/Infrastructure/Mongoose/Repositories/SupplyRepository'
    )
    //Register Module Supply Type
    const { default: SupplyType } = await import(
      'App/Core/SupplyType/Infrastructure/Mongoose/Models/SupplyType'
    )
    const { default: SupplyTypeRepository } = await import(
      'App/Core/SupplyType/Infrastructure/Mongoose/Repositories/SupplyTypeRepository'
    )

    //Register Module Supply Version
    const { default: CollectionVersion } = await import(
      'App/Core/CollectionVersion/Infrastructure/Mongoose/Models/CollectionVersion'
    )
    const { default: CollectionVersionRepository } = await import(
      'App/Core/CollectionVersion/Infrastructure/Mongoose/Repositories/CollectionVersionRepository'
    )

    //Register Module Lot
    const { default: Lot } = await import(
      'App/Core/Lot/Infrastructure/Mongoose/Models/Lot'
    )
    const { default: LotRepository } = await import(
      'App/Core/Lot/Infrastructure/Mongoose/Repositories/LotRepository'
    )

    //Register Module Farm
    const { default: Farm } = await import(
      'App/Core/Farm/Infrastructure/Mongoose/Models/Farm'
    )
    const { default: FarmRepository } = await import(
      'App/Core/Farm/Infrastructure/Mongoose/Repositories/FarmRepository'
    )

    //Registers
    this.app.container.singleton(
      'Ucropit/Core/RolRepository',
      () => new RolRepository(Rol)
    )
    this.app.container.singleton(
      'Ucropit/Core/CropRepository',
      () => new CropRepository(Crop)
    )
    this.app.container.singleton(
      'Ucropit/Core/AchievementRepository',
      () => new AchievementRepository(Achievement)
    )
    this.app.container.singleton(
      'Ucropit/Core/SupplyRepository',
      () => new SupplyRepository(Supply)
    )
    this.app.container.singleton(
      'Ucropit/Core/SupplyTypeRepository',
      () => new SupplyTypeRepository(SupplyType)
    )
    this.app.container.singleton(
      'Ucropit/Core/CollectionVersionRepository',
      () => new CollectionVersionRepository(CollectionVersion)
    )
    this.app.container.singleton(
      'Ucropit/Core/ActivityRepository',
      () => new ActivityRepository(Activity)
    )
    this.app.container.singleton(
      'Ucropit/Core/LotRepository',
      () => new LotRepository(Lot)
    )
    this.app.container.singleton(
      'Ucropit/Core/StorageRepository',
      () => new FileStorageRepository(new FileStorage(Application.tmpPath()))
    )
    this.app.container.singleton(
      'Ucropit/Core/FileDocumentRepository',
      () => new FileDocumentRepository(FileDocument)
    )
    this.app.container.singleton(
      'Ucropit/Core/FarmRepository',
      () => new FarmRepository(Farm)
    )
  }

  public async boot() {
    // IoC container is ready
  }

  public async ready() {
    // App is ready
  }

  public async shutdown() {
    // Cleanup, since app is going down
  }
}
