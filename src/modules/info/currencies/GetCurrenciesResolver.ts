import { Query, Resolver, UseMiddleware } from 'type-graphql';
import { auth } from '../../../middlewares/auth';
import { Currency } from '../../../entity/Currency';

@Resolver()
export class GetCurrenciesResolver {
  @UseMiddleware(auth)
  @Query(() => [Currency], {nullable: true})
  async getCurrencies(
  ): Promise<Currency[] | null> {
    return Currency.find();
  }
}
