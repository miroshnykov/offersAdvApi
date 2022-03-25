import { Field, InputType } from 'type-graphql';
import { Equals, IsBoolean } from "class-validator";

@InputType()
export class Agreements {
  @Field(() => Boolean)
  @IsBoolean()
  @Equals(true)
  safeData!: boolean;

  @Field(() => Boolean)
  @IsBoolean()
  @Equals(true)
  safeGuidelines!: boolean;

  @Field(() => Boolean)
  @IsBoolean()
  @Equals(true)
  safeNetwork!: boolean;

  @Field(() => Boolean)
  @IsBoolean()
  @Equals(true)
  selfTrademark!: boolean;

  @Field(() => Boolean)
  @IsBoolean()
  @Equals(true)
  readAgreements!: boolean;
}
