import { EventsAuditEntitiesRepositoryContract } from '../../Contracts'
import { EventsAuditEntitiesDocument } from '../Interfaces'

export default class EventsAuditEntitiesRepository
  implements EventsAuditEntitiesRepositoryContract
{
  constructor(private eventsAuditEntitiesModel) {}
  public async count<Object>(query: Object): Promise<any> {
    return this.eventsAuditEntitiesModel.find(query).count()
  }
  public async create<EventsAuditEntities>(
    data: EventsAuditEntities
  ): Promise<EventsAuditEntitiesDocument> {
    return this.eventsAuditEntitiesModel.create(data)
  }
  public async findAll<Object>(
    query: Object
  ): Promise<EventsAuditEntitiesDocument[]> {
    return this.eventsAuditEntitiesModel.find(query)
  }
  public async findOne<Object>(
    query: Object
  ): Promise<EventsAuditEntitiesDocument> {
    return this.eventsAuditEntitiesModel.findOne(query)
  }
  public async findOneAndUpdate<Object>(
    query: Object,
    querySet: Object
  ): Promise<any> {
    return this.eventsAuditEntitiesModel.findOneAndUpdate(query, querySet)
  }

  public async findByCursor<Object>(
    query: Object
  ): Promise<Iterator<EventsAuditEntitiesDocument>> {
    return this.eventsAuditEntitiesModel.find(query).cursor()
  }
  public async deleteOne<Object>(query: Object): Promise<any> {
    return this.eventsAuditEntitiesModel.deleteOne(query)
  }
}
