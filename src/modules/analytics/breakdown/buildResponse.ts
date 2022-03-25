import BreakdownResponse from './BreakdownResponse';
import BreakdownItem from './BreakdownItem';

export default (result: any): BreakdownResponse => {
  const items: BreakdownItem[] = [];
  result.data.forEach((item: any) => {
    const data: BreakdownItem = {
      clicks: parseInt(item.clicks, 10),
      conversions: parseInt(item.conversions, 10),
      revenue: Number(item.revenue),
    };

    if (item.offer && item.offer_id) {
      data.offer = item.offer;
      data.offer_id = item.offer_id;
    }

    if (item.campaign) {
      data.campaign = item.campaign;
    }

    if (item.day) {
      data.day = item.day;
    }

    if (item.device) {
      data.device = item.device;
    }

    if (item.geo) {
      data.geo = item.geo;
    }

    if (item.hour) {
      data.hour = item.hour;
    }

    if (item.os) {
      data.os = item.os;
    }

    items.push(data);
  });

  return { count: parseInt(result.count, 10), data: items };
};
