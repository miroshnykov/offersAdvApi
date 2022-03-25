import { Arg, Ctx, Mutation, Resolver, UseMiddleware, } from 'type-graphql';
import { Offer } from '../../../entity/Offer';
import { GqlContext } from '../../../types/GqlContext';
import { auth } from '../../../middlewares/auth';
import { UpdateOfferInput } from './UpdateOfferInput';
import { User } from '../../../entity/User';
import { OfferGeo } from '../../../entity/OfferGeo';
import { Landing } from '../../../entity/Landing';
import { CustomLanding } from '../../../entity/CustomLanding';
import { In, Not } from 'typeorm';
import { OfferCap } from '../../../entity/OfferCap';
import { OfferCustomPayin } from '../../../entity/OfferCustomPayin';
import { sendMail } from '../../../utils/sendMail';
import { Manager } from '../../../entity/Manager';
import { EmailBodies } from '../../../constants/EmailConstants';
import { OfferStatus } from '../../../constants/OfferStatus';

@Resolver()
export class UpdateOfferResolver {
  @UseMiddleware(auth)
  @Mutation(() => Offer, { nullable: true })
  async updateOffer(
    @Ctx() { payload }: GqlContext,
    @Arg('data', () => UpdateOfferInput) data: UpdateOfferInput,
  ): Promise<Offer> {
    const user = await User.findOneOrFail(payload!.userId);
    const manager = await Manager.findOneOrFail(user.advertiser_manager_id);
    const offer = await Offer.findOneOrFail({
      where: {
        id: data.id,
        sfl_advertiser_id: user.id,
      },
    });
    if (offer && user) {
      offer.sfl_advertiser_id = user.id;
      offer.user = user.email;
      // From data
      offer.name = data.name;
      offer.conversion_type = data.conversion_type;
      offer.sfl_vertical_id = data.sfl_vertical_id;
      offer.currency_id = data.currency_id;
      offer.descriptions = data.descriptions;
      offer.is_cpm_option_enabled = data.is_cpm_option_enabled;
      offer.payin = data.payin;
      offer.use_start_end_date = data.use_start_end_date;
      if (data.step) {
        offer.step = data.step;
        offer.status = OfferStatus.DRAFT;
      }
      if (data.step >= 7) {
        offer.step = 0;
        offer.status = OfferStatus.PENDING;
      }

      if (data.use_start_end_date) {
        offer.start_date = new Date(data.start_date);
        if(data.end_date) {
          offer.end_date = new Date(data.end_date);
        } else {
          offer.end_date = null;
        }
      } else {
        offer.start_date = null;
        offer.end_date = null;
      }

      if(data.payout_percent) {
        offer.payout_percent = data.payout_percent;
      }
      offer.sessionUser = user.email
      await offer.save();
      // set GEOs
      let offerGeo = null;
      if (offer.sfl_offer_geo_id) {
        offerGeo = await OfferGeo.findOne({
          where: {
            id: offer.sfl_offer_geo_id,
            sfl_offer_id: data.id,
          },
        });
      } else {
        // try to get wrong data
        offerGeo = await OfferGeo.findOne({
          where: {
            sfl_offer_id: data.id,
          }
        });
        if (!offerGeo) {
          offerGeo = OfferGeo.create();
          offerGeo.sfl_offer_id = data.id;
          offerGeo.date_added = Date.now() / 1000;
        }
      }
      if (offerGeo) {
        offerGeo.rules = data.geoRules;
        offerGeo.sessionUser = user.email
        const savedGeo = await offerGeo.save();
        offer.sfl_offer_geo_id = savedGeo.id;
      }

      // set Landings
      if (data.landings && Array.isArray(data.landings)) {
        const allIds = data.landings.map((lp) => lp.id);
        await Landing.delete({
          sfl_offer_id: data.id,
          id: Not(In(allIds)),
        });
        data.landings = await Promise.all(data.landings.map(async (lp) => {
          let landing = Landing.create();
          if (lp.id) {
            const founded = await Landing.findOne({
              where: {
                id: lp.id,
                sfl_offer_id: offer.id,
              },
            });
            if (!founded) {
              throw new Error(`Landing with id: ${lp.id} not found.`);
            }
            landing = founded;
          } else {
            landing.date_added = Date.now() / 1000;
            landing.params = '';
            landing.user = user.email;
          }
          landing.sfl_offer_id = offer.id;
          landing.name = lp.name;
          landing.url = lp.url;
          landing.sessionUser = user.email
          await landing.save();

          if (lp.isDefault) {
            offer.sfl_offer_landing_page_id = landing.id;
          }
          lp.id = landing.id;
          return lp;
        }));
      }

      // set customLP
      if (data.customLandings && Array.isArray(data.landings)) {
        let customLg = await CustomLanding.findOne({
          where: {
            sfl_offer_id: data.id,
          },
        });
        const rules = JSON.stringify({
          customLPRules: data.customLandings.map((clp: any) => {
            const landing = data.landings.find((lp) => lp.name === clp.name && lp.url === clp.url);
            if (landing) {
              clp.id = landing.id;
            }
            clp.lpName = clp.name;
            delete clp.name;
            clp.lpUrl = clp.url;
            delete clp.url;
            return clp;
          }),
        })
        if (customLg) {
          customLg.rules = rules;
        } else {
          customLg = CustomLanding.create();
          customLg.sfl_offer_id = data.id;
          customLg.rules = rules;
          customLg.date_added = Date.now() / 1000;
        }
        customLg.sessionUser = user.email
        await customLg.save();
      }
      let cap = {} as any;
      if (data.caps) {
        cap = await OfferCap.findOne({
          where: {
            sfl_offer_id: data.id,
          },
        });
        if (!cap) {
          cap = OfferCap.create();
          cap.sfl_offer_id = data.id;
          cap.date_added = Date.now() / 1000;
          cap.clicks_redirect_offer_id = 0;
          cap.sales_redirect_offer_id = 0;
        }
        cap.enabled = data.caps.enabled;

        cap.clicks_day = data.caps.clicks_day;
        cap.clicks_week = data.caps.clicks_week;
        cap.clicks_month = data.caps.clicks_month;

        cap.sales_day = data.caps.sales_day;
        cap.sales_week = data.caps.sales_week;
        cap.sales_month = data.caps.sales_month;
        if (data.caps.start_date) {
          cap.start_date = new Date(data.caps.start_date);
        } else {
          cap.start_date = null;
        }
        if (data.caps.end_date) {
          cap.end_date = new Date(data.caps.end_date);
        } else {
          cap.end_date = null;
        }
        cap.use_start_end_date = data.caps.use_start_end_date;
        if (!data.caps.use_start_end_date) {
          cap.start_date = null;
          cap.end_date = null;
        }
        cap.sessionUser = user.email
        await cap.save();
      }

      if (data.customPayin) {
        const updateIds = data.customPayin.map(i => i.id).filter(i => i);
        await OfferCustomPayin.delete({
          sfl_offer_id: data.id,
          id: Not(In(updateIds)),
        });

        await Promise.all(data.customPayin.map(async (item) => {
          let payin = null;
          if (item.id) {
            payin = await OfferCustomPayin.findOneOrFail({
              where: {
                id: item.id,
                sfl_offer_id: offer.id,
              },
            });
          } else {
            payin = OfferCustomPayin.create();
            payin.sfl_offer_id = offer.id;
            payin.date_added = ~~(Date.now() / 1000);
          }

          payin.geo = item.geo;
          payin.payin = item.payin;
          payin.sessionUser = user.email
          await payin.save();
        }));
      }
      await offer.save();
      const updatedOffer = await Offer.findOne(data.id);
      if (updatedOffer) {
        if (offer.status !== OfferStatus.DRAFT) {
          await sendMail(
            manager.email,
            `${user.name} (${user.id}) updated his offer ${offer.name} (${offer.id})`,
            EmailBodies.OFFER_UPDATED
          );
        }
        return updatedOffer;
      } else {
        throw new Error('Offer not found');
      }
    } else {
      throw new Error('Offer not found.');
    }
  }
}
