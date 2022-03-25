import {EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent} from 'typeorm';
import {OfferGeo} from '../entity/OfferGeo';
import {OfferGeoHistory} from '../modules/history/OfferGeoHistory';

@EventSubscriber()
export class OfferGeoSubscriber implements EntitySubscriberInterface<OfferGeo> {
    private service: OfferGeoHistory | undefined;

    listenTo(): any {
        return OfferGeo;
    }

    getService() {
        if (typeof this.service === 'undefined') {
            this.service = new OfferGeoHistory()
        }
        return this.service
    }

    async afterInsert (event: InsertEvent<OfferGeo>) {
        await this.getService().log({}, event.entity, 'create')
    }

    async afterUpdate(event: UpdateEvent<OfferGeo>): Promise<Promise<any> | void> {
        if (!event.entity && !event.databaseEntity) { // skip any queries where no results
            return
        }
        await this.getService()
            .log(event.databaseEntity, event.entity, 'update')
    }
}
