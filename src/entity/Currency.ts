import {
  BaseEntity, Column, Entity, PrimaryGeneratedColumn,
} from 'typeorm';
import {
  Field, Int, ObjectType,
} from 'type-graphql';

@ObjectType()
@Entity('sfl_currency')
export class Currency extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column('varchar', { length: 45 })
  symbol!: string;

  @Field()
  @Column('varchar', { length: 45 })
  abbr!: string;
}
