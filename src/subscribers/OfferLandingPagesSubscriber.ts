import {EntitySubscriberInterface, EventSubscriber, UpdateEvent, InsertEvent} from 'typeorm';
import {OfferLandingPagesHistory} from '../modules/history/OfferLandingPagesHistory';
import {Landing} from '../entity/Landing';

@EventSubscriber()
export class OfferLandingPagesSubscriber implements EntitySubscriberInterface<Landing> {
    private service: OfferLandingPagesHistory | undefined;

    listenTo(): any {
        return Landing;
    }

    getService() {
        if (typeof this.service === 'undefined') {
            this.service = new OfferLandingPagesHistory()
        }
        return this.service
    }

    async afterInsert (event: InsertEvent<Landing>) {
        await this.getService().log({}, event.entity, 'create')
    }

    async afterUpdate(event: UpdateEvent<Landing>): Promise<Promise<any> | void> {
        if (!event.entity && !event.databaseEntity) { // skip any queries where no results
            return
        }
        await this.getService()
            .log(event.databaseEntity, event.entity, 'update')
    }
}
