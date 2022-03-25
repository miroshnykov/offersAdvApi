import {
  BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn,
} from 'typeorm';
import {
  Field, InputType, Int, ObjectType,
} from 'type-graphql';
import { LandingStatus } from '../constants/LandingStatus';
import { Offer } from './Offer';

@ObjectType()
@Entity('sfl_offer_landing_pages')
export class Landing extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id!: number;

  @Column('int', { width: 10, unsigned: true })
  sfl_offer_id!: number;

  @ManyToOne(() => Offer)
  @JoinColumn({ name: 'sfl_offer_id' })
  sfl_offer?: Offer;

  @Field()
  @Column('varchar', { length: 150 })
  name!: string;

  @Field(() => String, { nullable: true })
  @Column('text')
  url!: string;

  @Field()
  @Column('varchar', { length: 128 })
  params!: string;

  @Field()
  isDefault!: boolean;

  @Field()
  @Column({ type: 'enum', enum: LandingStatus, default: LandingStatus.INACTIVE })
  status!: LandingStatus;

  @Column('varchar', { length: 128 })
  user!: string;

  @Field()
  @Column('int', { width: 11 })
  date_added!: number;

  @Field()
  @Column('timestamp', { onUpdate: 'CURRENT_TIMESTAMP()' })
  date_updated!: string;

  sessionUser?: string;
}

@InputType()
export class LandingsInput {
  @Field(() => Int, { nullable: true })
  id!: number;

  @Field()
  name!: string;

  @Field()
  url!: string;

  @Field({ nullable: true })
  isDefault!: boolean;
}
