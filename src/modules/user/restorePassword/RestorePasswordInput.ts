import { Field, InputType } from 'type-graphql';
import { IsJWT, Length } from 'class-validator';
import { Match } from '../../../utils/custom-validations/match';

@InputType()
export class RestorePasswordInput {
  @Field()
  @IsJWT()
  token!: string;

  @Field()
  @Length(8)
  password!: string;

  @Field()
  @Length(8)
  @Match('password', { message: 'Passwords don\'t match' })
  repeatPassword!: string;
}
