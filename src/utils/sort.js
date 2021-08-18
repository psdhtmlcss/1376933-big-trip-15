import dayjs from 'dayjs';
export const sortByDay = (points) => {
  points.sort((a, b) => {
    a = new Date(a.date_from);
    b = new Date(b.date_from);
    if (a > b) {
      return 1;
    } else if (a < b) {
      return -1;
    } else {
      return 0;
    }
  });
};

export const sortByTime = (points) => {
  points.sort((a, b) => {
    const startA = dayjs(a.date_from);
    const endA = dayjs(a.date_to);
    const startB = dayjs(b.date_from);
    const endB = dayjs(b.date_to);
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
};

export const sortByPrice = (points) => {
  points.sort((a, b) => {
    a = a.base_price;
    b = b.base_price;
    if (a > b) {
      return -1;
    } else if (a < b) {
      return 1;
    } else {
      return 0;
    }
  });
};
