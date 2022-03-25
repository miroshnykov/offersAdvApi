import {Offer} from '../../entity/Offer';
import {AbstractHistory} from './AbstractHistory';
import {Vertical} from "../../entity/Vertical";
import camelcaseKeys from "camelcase-keys";

export class OfferHistory extends AbstractHistory {

    constructor() {
        super()
    }

    get entityName () {
        return 'offer'
    }

    customFieldName(oldData: Offer, newData: Offer) {
        return {}
    }

    get excludedFields() {
        return ['id', 'dateUpdated', 'sessionUser', 'step']
    }

    async log(oldData: any, newData: any, action: String) {
        let preparedData = await this.prepareData(oldData, newData)
        await super.log(preparedData.preparedOldData, preparedData.preparedNewData, action, newData.id, newData.sessionUser)
    }

    async prepareData(oldData: any, newData: any) {
        let preparedNewData = Object.assign({}, newData)
        let preparedOldData = Object.assign({}, oldData)
        if (Object.keys(preparedOldData).length) {
            let verticalOld = await Vertical.findOneOrFail(preparedOldData.sfl_vertical_id)
            let changesDataOld = {
                verticalName: verticalOld.name,
                email: preparedOldData.user,
                currencyId: preparedOldData.currency_id,
                payoutPercent: preparedOldData.payout_percent,
                conversionType: preparedOldData.conversion_type,
                payIn: +preparedOldData.payin,
                offerIdRedirect: preparedOldData.offer_id_redirect,
            }
            preparedOldData = Object.assign(preparedOldData, changesDataOld)
            preparedOldData.is_cpm_option_enabled = Boolean(preparedOldData.is_cpm_option_enabled)
            preparedOldData.use_start_end_date = Boolean(preparedOldData.use_start_end_date)
            preparedOldData.start_date = preparedOldData.start_date ? preparedOldData.start_date.toString() : null
            preparedOldData.end_date = preparedOldData.end_date ? preparedOldData.end_date.toString() : null
            delete preparedOldData.sfl_vertical_id
            delete preparedOldData.user
            delete preparedOldData.currency_id
            delete preparedOldData.payout_percent
            delete preparedOldData.conversion_type
            delete preparedOldData.payin
            delete preparedOldData.offer_id_redirect
        }
        let verticalNew = await Vertical.findOneOrFail(preparedNewData.sfl_vertical_id)
        let changesDataNew = {
            verticalName: verticalNew.name,
            email: preparedNewData.user,
            currencyId: preparedNewData.currency_id,
            payoutPercent: preparedNewData.payout_percent,
            conversionType: preparedNewData.conversion_type,
            payIn: preparedNewData.payin,
            offerIdRedirect: preparedNewData.offer_id_redirect,
        }
        preparedNewData = Object.assign(preparedNewData, changesDataNew)
        preparedNewData.start_date = preparedNewData.start_date ? preparedNewData.start_date.toString() : null
        preparedNewData.end_date = preparedNewData.end_date ? preparedNewData.end_date.toString() : null
        delete preparedNewData.sfl_vertical_id
        delete preparedNewData.user
        delete preparedNewData.currency_id
        delete preparedNewData.payout_percent
        delete preparedNewData.conversion_type
        delete preparedNewData.payin
        delete preparedNewData.offer_id_redirect
        preparedOldData = camelcaseKeys(preparedOldData)
        preparedNewData = camelcaseKeys(preparedNewData)
        return {
            preparedOldData,
            preparedNewData
        }
    }
}
