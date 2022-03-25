import { Field, Int, ObjectType } from 'type-graphql';
import { Offer } from '../../../entity/Offer';

@ObjectType()
export class ListOfferResponse {
  @Field(() => [Offer])
  data!: Offer[];

  @Field(() => Int, { nullable: true })
  count?: number;
}
