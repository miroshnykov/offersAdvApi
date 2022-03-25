import { Field, Int, ObjectType } from 'type-graphql';

@ObjectType()
export default class ReportResponse {
  @Field(() => [String])
  dates!: string[];

  @Field(() => [Int])
  clicks!: number[];

  @Field(() => [Int])
  conversions!: number[];
}
