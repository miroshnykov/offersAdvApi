import {
  Arg,
  Ctx, Int, Query, Resolver, UseMiddleware,
} from 'type-graphql';
import { User } from '../../../entity/User';
import { GqlContext } from '../../../types/GqlContext';
import { auth } from '../../../middlewares/auth';
import { processPeriod } from '../../../utils/processPeriod';
import requestClient from '../../../utils/requestClient';
import BreakdownResponse from './BreakdownResponse';
import buildQuery from './buildQuery';
import { getKeyValue } from '../../../utils/helper';
import { IEntityName } from '../../../types/IEntityName';
import buildResponse from './buildResponse';

@Resolver()
export class BreakdownResolver {
  @Query(() => BreakdownResponse, { nullable: true })
  @UseMiddleware(auth)
  async breakdown(
    @Ctx() { payload }: GqlContext,
      @Arg('entity') entityName: string,
      @Arg('orderBy') orderBy: string,
      @Arg('orderAsc') orderAsc: boolean,
      @Arg('page', () => Int) page: number,
      @Arg('limit', () => Int) limit: number,
      @Arg('periodType') periodType: string,
      @Arg('customPeriod', () => [String], { nullable: true }) customPeriod?: string[] | null | undefined,
  ): Promise<BreakdownResponse | null> {
    const user = await User.findOne(payload!.userId);
    if (!user) {
      return null;
    }
    const { startDate, endDate } = processPeriod(periodType, customPeriod);
    const entityNameMap: IEntityName = {
      offer: 'offer_id',
    };

    const orderByModified = entityNameMap[orderBy] ? entityNameMap[orderBy] : orderBy;

    const entity = getKeyValue<keyof IEntityName, IEntityName>(entityName)(entityNameMap)
      || entityName;
    const query = buildQuery(entity, entityName);
    const variables = {
      userId: user.id.toString(),
      startDate: Math.round(startDate.toSeconds()),
      endDate: Math.round(endDate.toSeconds()),
      entity,
      orderBy: orderByModified,
      orderAsc,
      page,
      limit,
    };
    try {
      const response = await requestClient('reports').post('', {query, variables});
      const { reports } = response.data.data;
      return buildResponse(reports);
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}
