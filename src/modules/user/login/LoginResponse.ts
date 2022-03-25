import { Field, ObjectType } from 'type-graphql';
import { User } from '../../../entity/User';
import RefreshResponse from './RefreshResponse';

@ObjectType()
export default class LoginResponse extends RefreshResponse {
  @Field()
  user!: User;
}
