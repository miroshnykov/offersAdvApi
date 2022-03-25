import {OfferCustomPayin} from '../../entity/OfferCustomPayin';
import {AbstractHistory} from './AbstractHistory';
import camelcaseKeys from "camelcase-keys";

export class OffersCustomPayoutHistory extends AbstractHistory {

    constructor() {
        super()
    }

    get entityName () {
        return 'offers_custom_payout'
    }

    customFieldName(oldData: OfferCustomPayin, newData: OfferCustomPayin) {
        return {}
    }

    get excludedFields() {
        return ['id', 'sessionUser']
    }

    async log(oldData: any, newData: any, action: String) {
        oldData.payin = +oldData.payin
        newData.payin = +newData.payin
        oldData.payout = +oldData.payout
        newData.payout = +newData.payout
        await super.log(camelcaseKeys(oldData), camelcaseKeys(newData), action, newData.sfl_offer_id, newData.sessionUser)
    }
}
