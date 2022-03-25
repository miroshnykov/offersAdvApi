import {
  BaseEntity, Column, Entity, PrimaryGeneratedColumn,
} from 'typeorm';
import {
  Field,
  Int, ObjectType,
} from 'type-graphql';

@ObjectType()
@Entity('sfl_managers')
export class Manager extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn({ type: 'int' })
  id!: number;

  @Field()
  @Column('varchar', { length: 100 })
  first_name!: string;

  @Field()
  @Column('varchar', { length: 100 })
  last_name!: string;

  @Field()
  @Column('varchar', { length: 50})
  email!: string;
}
