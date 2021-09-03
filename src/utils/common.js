import {TimeMetric, NumberSign} from '../const';

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
    return time < NumberSign.TEN ? `0${time}M` : `${time}M`;
  } else if (time <= TimeMetric.MIN_IN_DAY) {
    hours = Math.round(time / TimeMetric.MIN_IN_HOURS);
    minutes = time % TimeMetric.MIN_IN_HOURS;
    hours = hours < NumberSign.TEN ? `0${hours}H` : `${hours}H`;
    minutes = minutes < NumberSign.TEN ? `0${minutes}M` : `${minutes}M`;
    return `${hours} ${minutes}`;
  } else {
    day = Math.round(time / TimeMetric.MIN_IN_DAY);
    hours = Math.round((time % TimeMetric.MIN_IN_DAY) / TimeMetric.MIN_IN_HOURS);
    minutes = (time % TimeMetric.MIN_IN_DAY) % TimeMetric.MIN_IN_HOURS;
    day = day < NumberSign.TEN ? `0${day}D` : `${day}D`;
    hours = hours < NumberSign.TEN ? `0${hours}H` : `${hours}H`;
    minutes = minutes < NumberSign.TEN ? `0${minutes}M` : `${minutes}M`;
    return `${day} ${hours} ${minutes}`;
  }
};

