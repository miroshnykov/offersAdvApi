import {
  Ctx,
  Arg,
  Query,
  Resolver,
  UseMiddleware,
} from 'type-graphql';
import { getConnection } from 'typeorm';
import { Offer } from '../../../entity/Offer';
import { auth } from '../../../middlewares/auth';
import { GqlContext } from '../../../types/GqlContext';
import { OfferFiltersInput } from './OfferFiltersInput';
import { OfferPaginationInput } from './OfferPaginationInput';
import { ListOfferResponse } from './ListOfferResponse';

@Resolver()
export class ListOfferResolver {
  @UseMiddleware(auth)
  @Query(() => ListOfferResponse, { nullable: true })
  async listOffer(
    @Ctx() { payload }: GqlContext,
      @Arg('filters', { nullable: true }) filters: OfferFiltersInput,
      @Arg('pagination') pagination: OfferPaginationInput,
      @Arg('search', { nullable: true }) search: string,
      @Arg('column', { nullable: true }) column: string,
  ): Promise<ListOfferResponse> {
    let query = getConnection().getRepository(Offer)
      .createQueryBuilder('offerList');

    if (column) {
      query = query.select(`DISTINCT offerList.${column}`, column);
    } else {
      query = query.leftJoinAndSelect('offerList.landing_page', 'landing',
        'landing.id = offerList.sfl_offer_landing_page_id');
    }

    let where: string = `
      offerList.sfl_advertiser_id = :advertiserId
      AND offerList.type = 'regular'
    `;
    const whereValues: any = {
      advertiserId: payload!.userId,
    };

    if (filters) {
      const tempFilters: any = filters;
      for (const prop in tempFilters) {
        if (!tempFilters[prop]) {
          delete tempFilters[prop];
        } else {
          where += ` AND offerList.${prop} IN (:${prop})`;
          whereValues[prop] = tempFilters[prop];
        }
      }
    }

    query = query.where(where, whereValues);

    if (search && search.length > 0) {
      let searchPrepared: string = '';
      const searchValue: any = {
        search: `%${search}%`,
      };

      searchPrepared += `
        (offerList.id LIKE :search
        OR offerList.name LIKE :search
        OR offerList.conversion_type LIKE :search
        OR offerList.payin LIKE :search
        OR offerList.status LIKE :search
        OR landing.url LIKE :search)
      `;

      query = query.andWhere(searchPrepared, searchValue);
    }

    if (pagination) {
      if (pagination.sortBy) {
        const alias = pagination.sortBy === 'url' ? 'landing' : 'offerList';
        query = query.orderBy(`${alias}.${pagination.sortBy}`, pagination.sortDesc ? 'DESC' : 'ASC');
      }

      if (pagination.currentPage) {
        query = query.skip((pagination.currentPage - 1) * pagination.itemsPerPage);
        query = query.take(pagination.itemsPerPage);
      } else {
        query = query.take(50);
      }
    }

    if (column) {
      const result = await query.getRawMany();
      return { data: result };
    }

    const result = await query.getManyAndCount();
    return { data: result[0], count: result[1] };
  }
}
