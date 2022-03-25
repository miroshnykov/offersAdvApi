import {
  BaseEntity, Column, Entity, PrimaryGeneratedColumn,
} from 'typeorm';
import {
  Field, ID, ObjectType,
} from 'type-graphql';

@ObjectType()
@Entity('sfl_offer_geo')
export class OfferGeo extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('int', { width: 10, unsigned: true })
  sfl_offer_id!: number;

  @Column('text')
  rules!: string;

  @Column('int', { width: 11 })
  date_added!: number;

  @Column('timestamp', {onUpdate: 'current_timestamp()'})
  date_updated!: string;

  sessionUser?: string
}
