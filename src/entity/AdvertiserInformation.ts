import { Field } from 'type-graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './User';

@Entity('sfl_advertiser_information')
export class AdvertiserInformation extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  advertiser_id!: number;

  @Column()
  first_name!: string;

  @Column()
  last_name!: string;

  @Column()
  business_name!: string;

  @Column({ nullable: true })
  top_countries?: string;

  @Column({ nullable: true })
  offered_products?: string;

  @Column({ type: 'text', nullable: true })
  other_networks?: string;

  @Column({ type: 'text', nullable: true })
  traffic_types?: string;

  @Column({ type: 'text', nullable: true })
  verticals?: string;

  @Column({ type: 'text', nullable: true })
  websites?: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @ManyToOne(() => User, (user) => user.affiliate_information, {onDelete: "CASCADE"})
  @JoinColumn({ name: 'advertiser_id' })
  user!: User;
}
