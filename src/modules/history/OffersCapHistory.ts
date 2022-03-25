import {OfferCap} from '../../entity/OfferCap';
import {AbstractHistory} from './AbstractHistory';
import camelcaseKeys from "camelcase-keys";

export class OffersCapHistory extends AbstractHistory {

    constructor() {
        super()
    }

    get entityName () {
        return 'offers_cap'
    }

    customFieldName(oldData: OfferCap, newData: OfferCap) {
        return {}
    }

    get excludedFields() {
        return ['id', 'sessionUser']
    }

    async log(oldData: any, newData: any, action: String) {
        oldData.useCapsEnabled = oldData.enabled
        newData.useCapsEnabled = newData.enabled
        oldData.use_start_end_date = Boolean(oldData.use_start_end_date)
        oldData.capsStartDate = oldData.start_date ? oldData.start_date.toString() : null
        oldData.capsEndDate = oldData.end_date ? oldData.end_date.toString() : null
        newData.capsStartDate = newData.start_date ? newData.start_date.toString() : null
        newData.capsEndDate = newData.end_date ? newData.end_date.toString() : null
        delete oldData.enabled
        delete newData.enabled
        delete oldData.start_date
        delete oldData.end_date
        delete newData.start_date
        delete newData.end_date
        await super.log(camelcaseKeys(oldData), camelcaseKeys(newData), action, newData.sfl_offer_id, newData.sessionUser)
    }
}
