import {OfferGeo} from '../../entity/OfferGeo';
import {AbstractHistory} from './AbstractHistory';
import camelcaseKeys from "camelcase-keys";

export class OfferGeoHistory extends AbstractHistory {

    constructor() {
        super()
    }

    get entityName () {
        return 'offer_geo'
    }

    customFieldName(oldData: OfferGeo, newData: OfferGeo) {
        return {}
    }

    get excludedFields() {
        return ['id', 'dateUpdated', 'sessionUser']
    }

    async log(oldData: any, newData: any, action: String) {
        await super.log(camelcaseKeys(oldData), camelcaseKeys(newData), action, newData.sfl_offer_id, newData.sessionUser)
    }
}
