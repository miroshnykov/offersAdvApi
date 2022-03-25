import {EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent} from 'typeorm';
import {Offer} from '../entity/Offer';
import {OfferHistory} from '../modules/history/OfferHistory';

@EventSubscriber()
export class OfferSubscriber implements EntitySubscriberInterface<Offer> {
    private service: OfferHistory | undefined;

    listenTo(): any {
        return Offer;
    }

    getService() {
        if (typeof this.service === 'undefined') {
            this.service = new OfferHistory()
        }
        return this.service
    }

    async afterInsert (event: InsertEvent<Offer>) {
        await this.getService().log({}, event.entity, 'create')
    }

    async afterUpdate(event: UpdateEvent<Offer>): Promise<Promise<any> | void> {
        if (!event.entity && !event.databaseEntity) { // skip any queries where no results
            return
        }
        await this.getService()
            .log(event.databaseEntity, event.entity, 'update')
    }
}
