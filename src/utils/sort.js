import dayjs from 'dayjs';
import {SortType} from '../const';

export const sortType = {
  [SortType.DAY]: (points) => {
    points.sort((a, b) => {
      a = new Date(a.dateFrom);
      b = new Date(b.dateFrom);
      return a - b;
    });
  },
  [SortType.TIME]: (points) => {
    points.sort((a, b) => {
      const startA = dayjs(a.dateFrom);
      const endA = dayjs(a.dateTo);
      const startB = dayjs(b.dateFrom);
      const endB = dayjs(b.dateTo);
      a = endA.diff(startA, 'millisecond');
      b = endB.diff(startB, 'millisecond');
      return b - a;
    });
  },
  [SortType.PRICE]: (points) => {
    points.sort((a, b) => b.basePrice - a.basePrice);
  },
};
