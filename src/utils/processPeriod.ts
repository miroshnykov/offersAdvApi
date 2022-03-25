import { DateTime } from 'luxon';
import { ReportPeriod } from '../types/ReportPeriod';

export const processPeriod = (periodType: string, customPeriod?: string[] | null): ReportPeriod => {
  const today = DateTime.now().endOf('day');
  switch (periodType) {
    case 'thisMonth':
      return {
        startDate: today.startOf('month'),
        endDate: today.endOf('month'),
      };
    case 'lastMonth':
      return {
        startDate: today.minus({ months: 1 }).startOf('month'),
        endDate: today.minus({ months: 1 }).endOf('month'),
      };
    case 'last30days':
      return {
        startDate: today.minus({ days: 30 }),
        endDate: today,
      };
    case 'custom':
      if (customPeriod && customPeriod.length >= 2) {
        return {
          startDate: DateTime.fromISO(customPeriod[0]).startOf('day'),
          endDate: DateTime.fromISO(customPeriod[1]).endOf('day'),
        };
      }
      break;
    case 'last7days':
    default:
      return {
        startDate: today.minus({ days: 7 }),
        endDate: today,
      };
  }

  return {
    startDate: today.minus({ weeks: 1 }),
    endDate: today,
  };
};
