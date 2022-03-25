import { DateTime, Interval } from 'luxon';
import ReportResponse from './ReportResponse';

type ResultItem = {
  day: string,
  clicks: number,
  conversions: number
};

export default (result: any, startDate: DateTime, endDate: DateTime): ReportResponse => {
  const clicks: number[] = [];
  const conversions: number[] = [];
  const interval = Interval.fromDateTimes(startDate.startOf('day'), endDate.endOf('day'));
  const dates = interval.splitBy({ days: 1 }).map((d) => d.start.toISODate());
  dates.forEach((date) => {
    const found = result.find((res: ResultItem): boolean => res.day === date);
    clicks.push(found ? found.clicks : 0);
    conversions.push(found ? found.conversions : 0);
  });

  return { dates, clicks, conversions };
};
