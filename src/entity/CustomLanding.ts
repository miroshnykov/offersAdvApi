import {
  BaseEntity, Column, Entity, PrimaryGeneratedColumn,
} from 'typeorm';
import {
  Field,
  InputType, Int,
  ObjectType,
} from 'type-graphql';

@ObjectType()
@Entity('sfl_offer_custom_landing_pages')
export class CustomLanding extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id!: number;

  @Column('int', { width: 10, unsigned: true })
  sfl_offer_id!: number;

  @Column('text')
  rules!: string;

  @Column('int', { width: 11 })
  date_added!: number;

  @Column('timestamp', { onUpdate: 'CURRENT_TIMESTAMP()' })
  date_updated!: string;

  sessionUser?: string;
}

@ObjectType()
export class CustomLandingsOutput {
  @Field(() => Int, { nullable: true })
  id!: number;

  @Field()
  pos!: number;

  @Field()
  country!: string;

  @Field()
  name!: string;

  @Field()
  url!: string;
}

@InputType()
export class CustomLandingsInput {
  @Field(() => Int, { nullable: true })
  id!: number;

  @Field()
  pos!: number;

  @Field()
  country!: string;

  @Field()
  name!: string;

  @Field()
  url!: string;
}
