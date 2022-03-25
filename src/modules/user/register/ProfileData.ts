import { Field, InputType } from 'type-graphql';
import { Length } from 'class-validator';

@InputType()
export class WebsiteData {
  @Field()
  site!: string;

  @Field()
  desc!: string;
}

@InputType()
export class ProfileData {
  @Field()
  @Length(1, 50)
  firstName!: string;

  @Field()
  @Length(1, 50)
  lastName!: string;

  @Field()
  businessName!: string;

  @Field({nullable: true})
  topCountries?: string;

  @Field({nullable: true})
  offeredProducts?: string;

  @Field(() => [String], {nullable: true})
  otherNetworks?: string[];

  @Field(() => [WebsiteData], {nullable: true})
  websites?: WebsiteData[];
}
