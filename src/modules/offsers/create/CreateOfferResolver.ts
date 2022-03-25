import { Arg, Ctx, Mutation, Resolver, UseMiddleware, } from 'type-graphql';
import { Offer } from '../../../entity/Offer';
import { GqlContext } from '../../../types/GqlContext';
import { auth } from '../../../middlewares/auth';
import { User } from '../../../entity/User';
import { OfferStatus } from '../../../constants/OfferStatus';

@Resolver()
export class CreateOfferResolver {
  @UseMiddleware(auth)
  @Mutation(() => Offer, { nullable: true })
  async createOffer(
    @Ctx() { payload }: GqlContext,
    @Arg('name') name: string,
    @Arg('step', { nullable: true }) step: number
  ): Promise<Offer | null> {
    const user = await User.findOne(payload!.userId);
    if (!user) {
      return null;
    }
    const offer = Offer.create();
    offer.name = name;
    offer.sfl_advertiser_id = parseInt(payload!.userId, 10);
    offer.date_added = Date.now() / 1000;
    offer.user = user!.email;
    offer.advertiser_manager_id = user.advertiser_manager_id;
    offer.start_date = null;
    offer.end_date = null;
    offer.use_start_end_date = false;
    if (step) {
      offer.status = OfferStatus.DRAFT;
      offer.step = step;
    } else {
      offer.status = OfferStatus.PENDING;
    }
    offer.sessionUser = user.email
    await offer.save();
    return offer;
  }
}
