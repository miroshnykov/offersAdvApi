import {CustomLanding} from '../../entity/CustomLanding';
import {AbstractHistory} from './AbstractHistory';
import camelcaseKeys from "camelcase-keys";

export class OfferCustomLandingPagesHistory extends AbstractHistory {

    constructor() {
        super()
    }

    get entityName () {
        return 'offer_custom_landing_pages'
    }

    customFieldName(oldData: CustomLanding, newData: CustomLanding) {
        return {}
    }

    get excludedFields() {
        return ['id', 'dateUpdated', 'sessionUser']
    }

    async log(oldData: any, newData: any, action: String) {
        await super.log(camelcaseKeys(oldData), camelcaseKeys(newData), action, newData.sfl_offer_id, newData.sessionUser)
    }
}
