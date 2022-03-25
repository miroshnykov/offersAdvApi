import { Field, InputType } from 'type-graphql';
import { IsEmail, Length } from 'class-validator';
import { Match } from '../../../utils/custom-validations/match';
import { Agreements } from './Agreements';
import { ProfileData } from './ProfileData';

@InputType()
export class RegisterInput {
  @Field()
  @IsEmail()
  email!: string;

  @Field()
  @Length(8)
  password!: string;

  @Field()
  @Length(8)
  @Match('password', { message: 'Passwords don\'t match' })
  repeatPassword!: string;

  @Field(() => ProfileData)
  profileData!: ProfileData;

  @Field(() => Agreements)
  agreements!: Agreements;
}
