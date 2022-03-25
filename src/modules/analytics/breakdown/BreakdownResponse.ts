import { Field, Int, ObjectType } from 'type-graphql';
import BreakdownItem from './BreakdownItem';

@ObjectType()
export default class BreakdownResponse {
  @Field(() => [BreakdownItem])
  data!: BreakdownItem[];

  @Field(() => Int)
  count!: number;
}
