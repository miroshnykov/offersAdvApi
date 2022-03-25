import {
  BaseEntity, Column, DeleteDateColumn, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn,
} from 'typeorm';
import {
  Field, Int, ObjectType,
} from 'type-graphql';
import { OfferStatus } from '../constants/OfferStatus';
import { ConversionType } from '../constants/ConversionType';
import { Vertical } from './Vertical';
import { Currency } from './Currency';
import { OfferGeo } from './OfferGeo';
import { Landing } from './Landing';
import { CustomLanding, CustomLandingsOutput } from './CustomLanding';
import { OfferCap } from './OfferCap';
import requestClient from '../utils/requestClient';
import { OfferCustomPayin } from './OfferCustomPayin';
import { Manager } from './Manager';

@ObjectType()
@Entity('sfl_offers')
export class Offer extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id!: number;

  @Field()
  @Column('varchar', { length: 128 })
  name!: string;

  @Field()
  @Column({ type: 'enum', enum: OfferStatus, default: OfferStatus.PENDING })
  status!: OfferStatus;

  @Field()
  @Column({ type: 'enum', enum: ConversionType, default: ConversionType.CPI })
  conversion_type!: ConversionType;

  @Column('int', { width: 11, default: 1 })
  sfl_advertiser_id!: number;

  @Column('int', { width: 10, unsigned: true, default: 1 })
  advertiser_manager_id!: number;

  @Field()
  @Column('int', { width: 10, unsigned: true, default: 1 })
  sfl_vertical_id!: number;

  @Field()
  @Column('varchar', { length: 255, default: '' })
  descriptions!: string;

  @Field()
  @Column('int', { width: 10, unsigned: true, default: 1 })
  currency_id!: number;

  @Column('varchar', { length: 50, default: '0' })
  user!: string;

  @Field(() => Landing, { nullable: true })
  @OneToMany(() => Landing,
    (landing) => landing.sfl_offer)
  @JoinColumn({ name: 'sfl_offer_landing_page_id' })
  landing_page?: Landing;

  @Column('int', { width: 11, default: 0 })
  sfl_offer_landing_page_id!: number;

  @Column('int', { width: 11, default: 0 })
  sfl_offer_geo_id!: number;

  @Field()
  @Column('int', { width: 11, default: 0 })
  offer_id_redirect!: number;

  @Field()
  @Column('tinyint', { width: 1, default: 1 })
  is_cpm_option_enabled!: boolean;

  @Field()
  @Column('decimal', { precision: 16, default: 0, scale: 8 })
  payin!: number;

  @Field(() => [Number], { nullable: true })
  @Column('int', { width: 11, default: 0 })
  payout_percent!: number | null;

  @Field()
  @Column('text', { nullable: true })
  restriction!: string;

  @Field()
  @Column('int', { width: 11 })
  date_added!: number;

  @Field()
  @Column('timestamp', { onUpdate: 'CURRENT_TIMESTAMP()' })
  date_updated!: string;

  @Field(() => Number, { nullable: true })
  @Column('timestamp')
  start_date!: Date | null;

  @Field(() => Number, { nullable: true })
  @Column('timestamp')
  end_date!: Date | null;

  @Field()
  @Column('text')
  type!: string;

  @Field()
  @Column('tinyint', { default: 0 })
  step!: number;

  @Field()
  @Column('tinyint', { width: 1 })
  use_start_end_date!: boolean;

  @Field(() => String)
  async advertiser_manager() {
    const manager = await Manager.findOneOrFail({
      where: {
        id: this.advertiser_manager_id,
      },
    });
    return `${manager.first_name} ${manager.last_name}`;
  }

  @Field(() => [Vertical])
  verticals() {
    return Vertical.find();
  }

  @Field(() => [Currency])
  currencies() {
    return Currency.find();
  }

  @Field(() => String, { nullable: true })
  async geoRules() {
    const geo = await OfferGeo.findOne({
      where: {
        sfl_offer_id: this.id,
      },
    });
    return geo?.rules;
  }

  @Field(() => [Landing], { nullable: true })
  async landings() {
    const landings = await Landing.find({
      where: {
        sfl_offer_id: this.id,
      },
    });
    return landings.map((lp) => {
      lp.isDefault = lp.id === this.sfl_offer_landing_page_id;
      return lp;
    });
  }

  @Field(() => [CustomLandingsOutput])
  async customLandings() {
    const customLP = await CustomLanding.findOne({
      where: {
        sfl_offer_id: this.id,
      },
    });
    if (customLP) {
      const parsed = JSON.parse(customLP?.rules!);
      return parsed.customLPRules.map((lp: any) => {
        const tmp = new CustomLandingsOutput();
        tmp.id = lp.id;
        tmp.name = lp.lpName;
        tmp.url = lp.lpUrl;
        tmp.pos = lp.pos;
        tmp.country = lp.country;
        return tmp;
      });
    }
    return [];
  }

  @Field(() => OfferCap)
  async caps() {
    const cap = await OfferCap.findOne({
      where: {
        sfl_offer_id: this.id,
      },
    });
    if (cap) {
      if (!cap.start_date?.valueOf()) {
        cap.start_date = null;
      }
      if (!cap.end_date?.valueOf()) {
        cap.end_date = null;
      }
      return cap;
    }
    const newCap = OfferCap.create();
    newCap.enabled = 0;
    newCap.clicks_day = 0;
    newCap.clicks_week = 0;
    newCap.clicks_month = 0;
    newCap.clicks_redirect_offer_use_default = false;
    newCap.clicks_redirect_offer_id = 0;

    newCap.sales_day = 0;
    newCap.sales_week = 0;
    newCap.sales_month = 0;
    newCap.sales_redirect_offer_use_default = false;
    newCap.sales_redirect_offer_id = 0;

    newCap.use_start_end_date = false;
    newCap.start_date = null;
    newCap.end_date = null;
    return newCap;
  }

  @Field(() => String)
  async token() {
    const result = await requestClient('postback').post('', {
      query: `query postback ($id: Int!) {
        getPostback(advertiserId: $id) {
          value
        }
      }`,
      variables: {
        id: this.sfl_advertiser_id,
      },
    });
    return result.data.data.getPostback.value;
  }

  @Field(() => [OfferCustomPayin])
  async customPayin() {
    return OfferCustomPayin.find({
      where: {
        sfl_offer_id: this.id,
      },
    });
  }

  @DeleteDateColumn()
  deleted_at!: Date | null;

  sessionUser?: string;
}
