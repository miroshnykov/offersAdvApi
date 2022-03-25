import {
  BaseEntity, Column, Entity, PrimaryGeneratedColumn,
} from 'typeorm';
import {
  Field, ObjectType, Int
} from 'type-graphql';

@ObjectType()
@Entity('sfl_vertical')
export class Vertical extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column('varchar', { length: 128 })
  name!: string;

  @Column('int', { width: 11 })
  date_added!: number;

  @Column('timestamp', { onUpdate: 'CURRENT_TIMESTAMP()' })
  date_updated!: string;
}
