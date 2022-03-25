import { Field, Int, InputType } from 'type-graphql';

@InputType()
export class OfferPaginationInput {
  @Field(() => Int, { nullable: true })
  currentPage?: number;

  @Field(() => Int)
  itemsPerPage!: number;

  @Field(() => String, { nullable: true })
  sortBy?: string;

  @Field(() => Boolean, { nullable: true })
  sortDesc?: boolean;
}
