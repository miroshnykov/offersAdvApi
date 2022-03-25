import {
  Arg,
  Ctx, Query, Resolver, UseMiddleware,
} from 'type-graphql';
import { User } from '../../../entity/User';
import { GqlContext } from '../../../types/GqlContext';
import { auth } from '../../../middlewares/auth';
import { processPeriod } from '../../../utils/processPeriod';
import requestClient from '../../../utils/requestClient';
import ReportResponse from './ReportResponse';
import buildQuery from './buildQuery';
import buildResponse from './buildResponse';

@Resolver()
export class ReportResolver {
  @Query(() => ReportResponse, { nullable: true })
  @UseMiddleware(auth)
  async reports(
    @Ctx() { payload }: GqlContext,
      @Arg('periodType') periodType: string,
      @Arg('customPeriod', () => [String], { nullable: true }) customPeriod?: string[],
  ): Promise<ReportResponse | null> {
    const user = await User.findOne(payload!.userId);
    if (!user) {
      return null;
    }
    const { startDate, endDate } = processPeriod(periodType, customPeriod);
    const query = buildQuery();
    const variables = {
      userId: user.id.toString(),
      startDate: Math.round(startDate.toSeconds()),
      endDate: Math.round(endDate.toSeconds()),
    };
    const response = await requestClient('reports').post('', { query, variables });
    const reports = response.data.data.reports.data;

    return buildResponse(reports, startDate, endDate);
  }
}
