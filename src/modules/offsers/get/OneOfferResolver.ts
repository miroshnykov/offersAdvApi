import {
  Arg, ID, Query, Resolver, UseMiddleware,
} from 'type-graphql';
import { Offer } from '../../../entity/Offer';
import { auth } from '../../../middlewares/auth';

@Resolver()
export class OneOfferResolver {
  @UseMiddleware(auth)
  @Query(() => Offer, { nullable: true })
  async getOffer(
    @Arg('id', () => ID) id: number,
  ): Promise<Offer> {
    const offer = await Offer.findOneOrFail(id);
    if (!offer.start_date?.valueOf()) {
      offer.start_date = null;
    }
    if (!offer.end_date?.valueOf()) {
      offer.end_date = null;
    }
    return offer;
  }
}
