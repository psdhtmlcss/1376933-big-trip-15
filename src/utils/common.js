import {TimeMetric, NumberSign, Reduction} from '../const';

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const calcEventDuration = (time) => {
  let day;
  let hours;
  let minutes;
  if (time <= TimeMetric.MIN_IN_HOURS) {
    return time < NumberSign.TEN ? `0${time}${Reduction.MINUTE}` : `${time}${Reduction.MINUTE}`;
  } else if (time <= TimeMetric.MIN_IN_DAY) {
    hours = Math.round(time / TimeMetric.MIN_IN_HOURS);
    minutes = time % TimeMetric.MIN_IN_HOURS;
    hours = hours < NumberSign.TEN ? `0${hours}${Reduction.HOURS}` : `${hours}${Reduction.HOURS}`;
    minutes = minutes < NumberSign.TEN ? `0${minutes}${Reduction.MINUTE}` : `${minutes}${Reduction.MINUTE}`;
    return `${hours} ${minutes}`;
  } else {
    day = Math.round(time / TimeMetric.MIN_IN_DAY);
    hours = Math.round((time % TimeMetric.MIN_IN_DAY) / TimeMetric.MIN_IN_HOURS);
    minutes = (time % TimeMetric.MIN_IN_DAY) % TimeMetric.MIN_IN_HOURS;
    day = day < NumberSign.TEN ? `0${day}${Reduction.DAY}` : `${day}${Reduction.DAY}`;
    hours = hours < NumberSign.TEN ? `0${hours}${Reduction.HOURS}` : `${hours}${Reduction.HOURS}`;
    minutes = minutes < NumberSign.TEN ? `0${minutes}${Reduction.MINUTE}` : `${minutes}${Reduction.MINUTE}`;
    return `${day} ${hours} ${minutes}`;
  }
};
