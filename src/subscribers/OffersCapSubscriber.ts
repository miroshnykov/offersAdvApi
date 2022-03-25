import {EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent} from 'typeorm';
import {OfferCap} from '../entity/OfferCap';
import {OffersCapHistory} from '../modules/history/OffersCapHistory';

@EventSubscriber()
export class OffersCapSubscriber implements EntitySubscriberInterface<OfferCap> {
    private service: OffersCapHistory | undefined;

    listenTo(): any {
        return OfferCap;
    }

    getService() {
        if (typeof this.service === 'undefined') {
            this.service = new OffersCapHistory()
        }
        return this.service
    }

    async afterInsert (event: InsertEvent<OfferCap>) {
        await this.getService().log({}, event.entity, 'create')
    }

    async afterUpdate(event: UpdateEvent<OfferCap>): Promise<Promise<any> | void> {
        if (!event.entity && !event.databaseEntity) { // skip any queries where no results
            return
        }
        await this.getService()
            .log(event.databaseEntity, event.entity, 'update')
    }
}
