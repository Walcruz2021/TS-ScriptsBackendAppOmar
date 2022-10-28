import {
  EOperationTypeDataBase,
  IEntity,
  EventsAuditEntities
} from '../../Mongoose/Interfaces/EventsAuditEntities.interface'
import UserRepository from 'App/Core/User/Infrastructure/Mongoose/Repositories'
export class CreateEventAuditUseCase {
  constructor(private entityRepo) {}

  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  async execute(
    idEntity: string,
    entity: IEntity,
    operationType: EOperationTypeDataBase
  ) {
    try {
      const userCommand = await UserRepository.findOne({
        email: 'commands@ucrop.it'
      })
      if (userCommand) {
        const dataEvent: EventsAuditEntities = {
          user: userCommand._id,
          documentKey: idEntity,
          entity: entity,
          operationType: operationType
        }
        await this.entityRepo.create(dataEvent)
      }
    } catch (error) {
      console.log(error)
    }
  }
}
