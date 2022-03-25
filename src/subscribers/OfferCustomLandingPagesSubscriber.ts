import {EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent} from 'typeorm';
import {CustomLanding} from '../entity/CustomLanding';
import {OfferCustomLandingPagesHistory} from '../modules/history/OfferCustomLandingPagesHistory';

@EventSubscriber()
export class OfferCustomLandingPagesSubscriber implements EntitySubscriberInterface<CustomLanding> {
    private service: OfferCustomLandingPagesHistory | undefined;

    listenTo(): any {
        return CustomLanding;
    }

    getService() {
        if (typeof this.service === 'undefined') {
            this.service = new OfferCustomLandingPagesHistory()
        }
        return this.service
    }

    async afterInsert (event: InsertEvent<CustomLanding>) {
        await this.getService().log({}, event.entity, 'create')
    }

    async afterUpdate(event: UpdateEvent<CustomLanding>): Promise<Promise<any> | void> {
        if (!event.entity && !event.databaseEntity) { // skip any queries where no results
            return
        }
        await this.getService()
            .log(event.databaseEntity, event.entity, 'update')
    }
}
