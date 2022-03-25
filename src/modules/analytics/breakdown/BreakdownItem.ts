import {
  Field, Float, Int, ObjectType,
} from 'type-graphql';

@ObjectType()
export default class BreakdownItem {
  @Field(() => Int)
  clicks!: number;

  @Field(() => Int)
  conversions!: number;

  @Field(() => Float)
  revenue!: number;

  @Field({ nullable: true })
  offer?: string;

  @Field({ nullable: true })
  offer_id?: number;

  @Field({ nullable: true })
  campaign?: string;

  @Field({ nullable: true })
  day?: string;

  @Field({ nullable: true })
  device?: string;

  @Field({ nullable: true })
  geo?: string;

  @Field({ nullable: true })
  hour?: string;

  @Field({ nullable: true })
  os?: string;
}
