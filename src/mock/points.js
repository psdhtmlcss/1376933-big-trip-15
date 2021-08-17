import dayjs from 'dayjs';
import {destinations} from './destinations';
import {offers} from './offers';
import {getRandomInteger} from '../utils/common';
import {nanoid} from 'nanoid';

const MIN_OFFERS_COUNT = 1;
const MAX_DAYS = 7;
const MIN_MINUTES = 30;
const MAX_MINUTES = 2880;

const generateType = () => (
  Object.keys(offers)[getRandomInteger(0, Object.keys(offers).length - 1)]
);

const generateOffers = (type) => {
  const isOffers = Boolean(getRandomInteger(0, 1));
  const selectedOffers = [];
  if (isOffers) {
    if (offers[type].length > 0) {
      for (let i = 0; i < getRandomInteger(MIN_OFFERS_COUNT, offers[type].length); i++) {
        selectedOffers.push(offers[type][i]);
      }
      return selectedOffers;
    } else {
      return null;
    }
  } else {
    return null;
  }
};

const generateDateFrom = () => {
  const dayGap = getRandomInteger(-MAX_DAYS, MAX_DAYS);
  const dateFrom = dayjs().add(dayGap, 'day').toISOString();

  return dateFrom;
};

export const generatePoint = () => {
  const minuteGap = getRandomInteger(MIN_MINUTES, MAX_MINUTES);
  const dateFrom = generateDateFrom();
  const dateTo = dayjs(dateFrom).add(minuteGap, 'm').toISOString();
  const type = generateType();

  return {
    'base_price': `${getRandomInteger(1, 9)}${getRandomInteger(0, 9)}0`,
    'date_from': dateFrom,
    'date_to': dateTo,
    'destination': destinations[getRandomInteger(0, destinations.length - 1)],
    'id': nanoid(),
    'is_favorite': Boolean(getRandomInteger(0, 1)),
    'offers': generateOffers(type),
    'type': type,
  };

};
