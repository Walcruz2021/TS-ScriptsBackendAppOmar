## Storage Service
Progressive registration in storage of the reading of a collection and that later it can rollback those that were updated
```js
import StorageService from 'App/Core/Storage/Services/StorageService'
import UserRepository from 'App/Core/User/Infrastructure/Mongoose/Repositories'

export default class CommanderName extends BaseCommand {
  //...
  private nameFileBackup: string = 'nameFileBackup.json'
  //...
  public async run() {
    //...
  }
  public async execute() {
    await StorageService.create([], this.nameFileBackup)
    const users: IUsers = await UserRepository.findAll({})
    for (const user of users) {
      await StorageService.add(user, this.nameFileBackup)
      //...
    }
  }
  public async rollback(): Promise<void> {
    const users = await StorageService.get(this.nameFileBackup)
    for (const user of users) {
      await UserRepository.replaceOne({
        _id: user._id
      },{
        ...user
      })
    }
  }
}
```
