import {Landing} from '../../entity/Landing';
import {AbstractHistory} from './AbstractHistory';
import {Offer} from "../../entity/Offer";
import camelcaseKeys from "camelcase-keys";

export class OfferLandingPagesHistory extends AbstractHistory {

    constructor() {
        super()
    }

    get entityName () {
        return 'offer_landing_pages'
    }

    customFieldName(oldData: Landing, newData: Landing) {
        return {}
    }

    get excludedFields() {
        return ['id', 'dateUpdated', 'sessionUser']
    }

    async log(oldData: any, newData: any, action: String) {
        let offer = await Offer.findOneOrFail(oldData.sfl_offer_id)
        if (offer.sfl_offer_landing_page_id === oldData.id) {
            oldData.defaultSiteName = oldData.url
            newData.defaultSiteName = newData.url
            delete oldData.url
            delete newData.url
        }
        oldData.landingPageName = oldData.name
        newData.landingPageName = newData.name
        delete oldData.name
        delete newData.name
        await super.log(camelcaseKeys(oldData), camelcaseKeys(newData), action, newData.sfl_offer_id, newData.sessionUser)
    }
}
