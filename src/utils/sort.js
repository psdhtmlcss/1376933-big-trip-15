import dayjs from 'dayjs';

export const sortType = {
  'sort-day': (points) => {
    points.sort((a, b) => {
      a = new Date(a.dateFrom);
      b = new Date(b.dateFrom);
      if (a > b) {
        return 1;
      } else if (a < b) {
        return -1;
      } else {
        return 0;
      }
    });
  },
  'sort-time': (points) => {
    points.sort((a, b) => {
      const startA = dayjs(a.dateFrom);
      const endA = dayjs(a.dateTo);
      const startB = dayjs(b.dateFrom);
      const endB = dayjs(b.dateTo);
      a = endA.diff(startA, 'millisecond');
      b = endB.diff(startB, 'millisecond');
      if (a > b) {
        return -1;
      } else if (a < b) {
        return 1;
      } else {
        return 0;
      }
    });
  },
  'sort-price': (points) => {
    points.sort((a, b) => {
      a = a.basePrice;
      b = b.basePrice;
      if (a > b) {
        return -1;
      } else if (a < b) {
        return 1;
      } else {
        return 0;
      }
    });
  },
};
