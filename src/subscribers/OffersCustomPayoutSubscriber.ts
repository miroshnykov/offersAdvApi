import {EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent} from 'typeorm';
import {OfferCustomPayin} from '../entity/OfferCustomPayin';
import {OffersCustomPayoutHistory} from '../modules/history/OffersCustomPayoutHistory';

@EventSubscriber()
export class OffersCustomPayoutSubscriber implements EntitySubscriberInterface<OfferCustomPayin> {
    private service: OffersCustomPayoutHistory | undefined;

    listenTo(): any {
        return OfferCustomPayin;
    }

    getService() {
        if (typeof this.service === 'undefined') {
            this.service = new OffersCustomPayoutHistory()
        }
        return this.service
    }

    async afterInsert (event: InsertEvent<OfferCustomPayin>) {
        await this.getService().log({}, event.entity, 'create')
    }

    async afterUpdate(event: UpdateEvent<OfferCustomPayin>): Promise<Promise<any> | void> {
        if (!event.entity && !event.databaseEntity) { // skip any queries where no results
            return
        }
        await this.getService()
            .log(event.databaseEntity, event.entity, 'update')
    }
}
