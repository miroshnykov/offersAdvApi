import { Field, Int, InputType } from 'type-graphql';

@InputType()
export class OfferFiltersInput {
  @Field(() => [Int], { nullable: true })
  id?: number[];

  @Field(() => [String], { nullable: true })
  name?: Array<string>;

  @Field(() => [String], { nullable: true })
  conversion_type?: Array<string>;

  @Field(() => [Int], { nullable: true })
  payin?: Array<number>;

  @Field(() => [String], { nullable: true })
  status?: Array<string>;
}
