import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export default class RefreshResponse {
  @Field()
  accessToken!: string;

  @Field()
  refreshToken!: string;
}
