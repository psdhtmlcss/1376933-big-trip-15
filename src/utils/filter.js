import {FilterType} from '../const';
export const filter = {
  [FilterType.EVERYTHING]: (points) => points.slice(),
  [FilterType.FUTURE]: (points) => points.filter((point) => Date.parse(point.dateFrom) >= Date.now() || Date.parse(point.dateTo) > Date.now()),
  [FilterType.PAST]: (points) => points.filter((point) => Date.parse(point.dateFrom) < Date.now()),
};
