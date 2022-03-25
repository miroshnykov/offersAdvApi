import {
  BaseEntity, Column, Entity, PrimaryGeneratedColumn,
} from 'typeorm';
import {
  Field, InputType, Int, ObjectType,
} from 'type-graphql';
import { PaymentType } from '../constants/PaymentType';

@ObjectType()
@Entity('sfl_offers_custom_payout')
export class OfferCustomPayin extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn({ type: 'int' })
  id!: number;

  @Column('int', { width: 10, unsigned: true })
  sfl_offer_id!: number;

  @Field()
  @Column('varchar', { length: 2 })
  geo!: string;

  @Column({ type: 'enum', enum: PaymentType, default: PaymentType.FIXED })
  payment_type!: string;

  @Field()
  @Column('decimal', { precision: 16, default: 0, scale: 8 })
  payin!: number;

  @Column('decimal', { precision: 16, default: 0, scale: 8 })
  payout!: number;

  @Column('int', { width: 11, default: 0 })
  payout_percent!: number;

  @Column('int')
  date_added!: number;

  sessionUser?: string
}

@InputType()
export class OfferCustomPayinInput {
  @Field(() => Int, { nullable: true })
  id!: number;

  @Field()
  geo!: string;

  @Field()
  payin!: number;
}
