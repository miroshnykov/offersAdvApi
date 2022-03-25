import { Query, Resolver, UseMiddleware } from 'type-graphql';
import { auth } from '../../../middlewares/auth';
import { Vertical } from '../../../entity/Vertical';

@Resolver()
export class GetVerticalsResolver {
  @UseMiddleware(auth)
  @Query(() => [Vertical], {nullable: true})
  async getVerticals(
  ): Promise<Vertical[] | null> {
    return Vertical.find();
  }
}
