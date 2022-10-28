import { BaseCommand, flags } from '@adonisjs/core/build/standalone'
import { Collections, CollectionsList } from 'App/Core/Collections'

export default class CollectionsUpdate extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'collections:update:date'

  /**
   * Command description is displayed in the "help" output
   */
  public static description =
    'This commands use for add createdAt and updatedAt'

  @flags.boolean({ alias: 'r', description: 'Rollback flag' })
  public rollbackCommand: boolean

  @flags.boolean({ alias: 'l', description: 'List Collection to Update' })
  public collectionsUpdateNames: boolean

  public static settings = {
    /**
     * Set the following value to true, if you want to load the application
     * before running the command
     */
    loadApp: true,

    /**
     * Set the following value to true, if you want this command to keep running until
     * you manually decide to exit the process
     */
    stayAlive: false
  }

  private getProgressBar(currentPercentage: number) {
    /**
     * Draw one cell for almost every 3%. This is to ensure the
     * progress bar renders fine on smaller terminal width
     */
    const completed = Math.ceil(currentPercentage / 3)
    const incomplete = Math.ceil((100 - currentPercentage) / 3)
    return `[${new Array(completed).join('=')}${new Array(incomplete).join(
      ' '
    )}]`
  }

  /**
   *
   * @param number index
   * @returns
   */
  private processingProgressBar(index: number, limit: number): number {
    if (index < limit) {
      index++
      const currentPercentage = Number(((index * 100) / limit).toFixed(2))
      this.logger.logUpdate(
        `Processing: ${this.getProgressBar(
          currentPercentage
        )} ${currentPercentage}% | ${index}/${limit}`
      )
    }
    return index
  }

  public async execute(): Promise<void> {
    let collectionItem
    let i = 0
    const collectionName = await this.prompt.ask(
      'Enter collection to update createdAt and updatedAt',
      {
        validate: this.validateNameCollection
      }
    )
    const collections = Collections[collectionName]

    if (!collections) {
      this.logger.error('Collections does not exist')
      await this.exit()
    }

    const query: unknown = {
      createdAt: { $exists: false }
    }

    const countItem: number = await collections.count(query)

    if (countItem === 0) {
      this.logger.info('The collection is already updated')
      await this.exit()
    }

    const cursor: Iterator<unknown> = await collections.find(query).cursor()

    while ((collectionItem = await cursor.next())) {
      await collections.findOneAndUpdate(
        {
          _id: collectionItem._id
        },
        {
          $set: {
            createdAt: collectionItem._id.getTimestamp(),
            updatedAt: collectionItem._id.getTimestamp()
          }
        },
        {
          timestamps: false
        }
      )

      i = this.processingProgressBar(i, countItem)
    }
  }

  private validateNameCollection(name: string): string | boolean {
    if (!name) {
      return 'Enter collection name'
    }

    if (!CollectionsList[name]) {
      return 'The collection name entered is not valid name, please check which valid normatives exists: --collections-update-names'
    }

    return true
  }

  public collectionList(): void {
    const table = this.ui.table()
    table.head(['Collections', 'Description'])
    table.columnWidths([20, 40])
    const collectionsList = Object.keys(CollectionsList).map((key) => {
      return {
        key: `${CollectionsList[key]}`,
        description: `Collection ${CollectionsList[key]}`
      }
    })

    for (const item of collectionsList) {
      table.row([item.key, item.description])
    }

    table.render()
  }

  public async run() {
    this.logger.success('Started updated createdAt and updatedAt')
    try {
      if (this.collectionsUpdateNames) {
        this.collectionList()
      } else {
        await this.execute()
      }
    } catch (error) {
      this.logger.error(`Error Message: ${error.message}`)
      this.logger.error(`Error: ${error}`)
      await this.exit()
    }
    this.logger.logUpdatePersist()
    this.logger.success('Finished updated createdAt and updatedAt')
  }
}
