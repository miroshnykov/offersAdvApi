import {
  Arg, Ctx, Mutation, Resolver, UseMiddleware,
} from 'type-graphql';
import { Offer } from '../../../entity/Offer';
import { GqlContext } from '../../../types/GqlContext';
import { auth } from '../../../middlewares/auth';
import requestClient from '../../../utils/requestClient';
import buildMutation from './buildMutation';
import { User } from '../../../entity/User';
import { sendMail } from '../../../utils/sendMail';
import { Manager } from '../../../entity/Manager';
import { Vertical } from '../../../entity/Vertical';
import { OfferCap } from '../../../entity/OfferCap';
import { Landing } from '../../../entity/Landing';
import { OfferGeo } from '../../../entity/OfferGeo';
import { CustomLanding } from '../../../entity/CustomLanding';
import { OfferDeleted } from '../../../constants/EmailConstants';
import { OfferCustomPayin } from '../../../entity/OfferCustomPayin';

@Resolver()
export class DeleteOfferResolver {
  @UseMiddleware(auth)
  @Mutation(() => Boolean, { nullable: true })
  async deleteOffer(
    @Ctx() { payload }: GqlContext,
    @Arg('id') id: number,
  ): Promise<boolean> {
    const user = await User.findOneOrFail(payload!.userId);
    const manager = await Manager.findOneOrFail(user?.advertiser_manager_id);
    const verticals = await Vertical.find();
    const cap = await OfferCap.findOne({
      where: {
        sfl_offer_id: id,
      },
    });
    const offer = await Offer.findOne({
      sfl_advertiser_id: user!.id,
      id,
    });
    const landings = await Landing.find({
      where: {
        sfl_offer_id: id,
      },
    });
    const geo = await OfferGeo.findOne({
      where: {
        sfl_offer_id: id,
      },
    });
    const customLanding = await CustomLanding.findOne({
      where: {
        sfl_offer_id: id,
      },
    });
    const customPayin = await OfferCustomPayin.find({
      where: {
        sfl_offer_id: id,
      }
    });

    if (!offer) {
      throw new Error('Offer not found');
    }

    if (offer?.status !== 'pending' && offer?.status !== 'inactive') {
      throw new Error(`You can not remove offer with status ${offer?.status}`);
    }
    const query = buildMutation(id);
    const sa = await requestClient('delOffer').post('', { query, variables: {} });
    if (sa.data.data.delOffer) {
      await sendMail(
        manager.email,
        `${user.name} (${user.id}) updated his offer ${offer.name} (${offer.id})`,
        OfferDeleted({
          offer,
          landings,
          verticals,
          customLanding,
          advertiser: user,
          cap,
          geo,
          customPayin,
        })
      );
      return true;
    } else {
      throw new Error(sa.data.errors[0].message);
    }
  }
}
