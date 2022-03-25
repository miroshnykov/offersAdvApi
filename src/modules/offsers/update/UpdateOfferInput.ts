import { Field, InputType, Int } from 'type-graphql';
import { Length, IsEnum, Min } from 'class-validator';
import { ConversionType } from '../../../constants/ConversionType';
import { CustomLandingsInput } from '../../../entity/CustomLanding';
import { LandingsInput } from '../../../entity/Landing';
import { OfferCapInput } from '../../../entity/OfferCap';
import { OfferCustomPayinInput } from '../../../entity/OfferCustomPayin';

@InputType()
export class UpdateOfferInput {
  @Field(() => Int)
  @Min(1)
  id!: number;

  @Field()
  @Length(1, 50)
  name!: string;

  @Field()
  @IsEnum(ConversionType)
  conversion_type!: ConversionType;

  @Field()
  sfl_vertical_id!: number;

  @Field()
  offer_id_redirect!: number;

  @Field()
  currency_id!: number;

  @Field()
  descriptions!: string;

  @Field()
  payin!: number;

  @Field({ nullable: true })
  payout_percent!: number;

  @Field()
  is_cpm_option_enabled!: boolean;

  @Field()
  geoRules!: string;

  @Field({nullable: true})
  step!: number;

  @Field(() => [LandingsInput], { nullable: true })
  landings!: LandingsInput[];

  @Field(() => [CustomLandingsInput], { nullable: true })
  customLandings!: CustomLandingsInput[];

  @Field(() => OfferCapInput, { nullable: true })
  caps!: OfferCapInput;

  @Field(() => [OfferCustomPayinInput], { nullable: true })
  customPayin!: OfferCustomPayinInput[];

  @Field()
  use_start_end_date!: boolean;

  @Field({nullable: true})
  start_date!: number;

  @Field({nullable: true})
  end_date!: number;
}
