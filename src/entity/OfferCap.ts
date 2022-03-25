import {
  BaseEntity, Column, Entity, PrimaryGeneratedColumn,
} from 'typeorm';
import {
  Field, InputType, Int, ObjectType,
} from 'type-graphql';
import { RedirectStatus } from '../constants/RedirectStatus';

@ObjectType()
@Entity('sfl_offers_cap')
export class OfferCap extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('int', { width: 10, unsigned: true })
  sfl_offer_id!: number;

  @Field()
  @Column('tinyint', { width: 1, default: 0 })
  enabled!: number;

  // Clicks cap
  @Field()
  @Column('int', { width: 11 })
  clicks_day!: number;

  @Field()
  @Column('int', { width: 11 })
  clicks_week!: number;

  @Field()
  @Column('int', { width: 11 })
  clicks_month!: number;

  @Column({ type: 'enum', enum: RedirectStatus, default: RedirectStatus.DEFAULT })
  clicks_redirect_status!: RedirectStatus;

  @Field()
    @Column('int', { width: 10, unsigned: true, default: 0 })
  clicks_redirect_offer_id!: number;

  @Field()
  @Column('tinyint', { width: 1, default: true })
  clicks_redirect_offer_use_default!: boolean;

  // Sales cap
  @Field()
  @Column('int', { width: 11 })
  sales_day!: number;

  @Field()
  @Column('int', { width: 11 })
  sales_week!: number;

  @Field()
  @Column('int', { width: 11 })
  sales_month!: number;

  @Column({ type: 'enum', enum: RedirectStatus, default: RedirectStatus.DEFAULT })
  sales_redirect_status!: RedirectStatus;

  @Field()
  @Column('int', { width: 10, unsigned: true, default: 0 })
  sales_redirect_offer_id!: number;

  @Field()
  @Column('tinyint', { width: 1, default: true })
  sales_redirect_offer_use_default!: boolean;

  // Dates cap
  @Field(() => Number, {nullable: true})
  @Column('timestamp', { nullable: true })
  start_date!: Date | null;

  @Field(() => Number, {nullable: true})
  @Column('timestamp', { nullable: true })
  end_date!: Date | null;

  @Field()
  @Column('tinyint', { width: 1 })
  use_start_end_date!: boolean;

  @Column('int', { width: 11 })
  date_added!: number;

  sessionUser?: string
}

@InputType()
export class OfferCapInput {
  @Field()
  enabled!: number;

  @Field()
  clicks_day!: number;

  @Field()
  clicks_week!: number;

  @Field()
  clicks_month!: number;

  @Field()
  sales_day!: number;

  @Field()
  sales_week!: number;

  @Field()
  sales_month!: number;

  @Field({nullable: true})
  start_date!: number;

  @Field({nullable: true})
  end_date!: number;

  @Field()
  use_start_end_date!: boolean;
}
