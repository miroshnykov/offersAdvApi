import { Ctx, Query, Resolver, UseMiddleware } from 'type-graphql';
import { auth } from '../../../middlewares/auth';
import requestClient from '../../../utils/requestClient';
import { GqlContext } from '../../../types/GqlContext';

@Resolver()
export class GetToken {
  @UseMiddleware(auth)
  @Query(() => String, {nullable: true})
  async getToken(
    @Ctx() { payload }: GqlContext,
  ): Promise<String | null> {
    const result = await requestClient('postback').post('', {
      query: `query postback ($id: Int!) {
        getPostback(advertiserId: $id) {
          value
        }
      }`,
      variables: {
        id: payload!.userId
      }
    });
    return result.data.data.getPostback.value;
  }
}
