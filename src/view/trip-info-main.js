import AbstractView from './abstract';
import dayjs from 'dayjs';

const MIN_NUMBER_CITIES = 3;
const TWO = 2;
const DOTS = '...';
const MDASH = '&mdash;';

const renderTimeInterval = (points) => {
  let str = '';
  if (points.length > TWO) {
    const dateStart = points[0].dateFrom;
    const dateEnd = points[points.length - 1].dateTo;
    if (dayjs(dateStart).month() !== dayjs(dateEnd).month()) {
      if (dayjs(dateStart).year() === dayjs(dateEnd).year()) {
        str = `${dayjs(dateStart).format('MMM D')} ${MDASH} ${dayjs(dateEnd).format('MMM D')}`;
      } else {
        str = `${dayjs(dateStart).format('YYYY MMM D')} ${MDASH} ${dayjs(dateEnd).format('YYYY МММ D')}`;
      }
    } else {
      if (dayjs(dateStart).year() === dayjs(dateEnd).year()) {
        str = `${dayjs(dateStart).format('MMM D')} ${MDASH} ${dayjs(dateEnd).format('D')}`;
      } else {
        str = `${dayjs(dateStart).format('YYYY MMM D')} ${MDASH} ${dayjs(dateEnd).format('YYYY МММ D')}`;
      }
    }
  }
  return str;
};

const renderCities = (points) => {
  let str = '';
  if (points.length > MIN_NUMBER_CITIES) {
    str = `${points[0].destination.name} ${MDASH} ${DOTS} ${MDASH} ${points[points.length - 1].destination.name}`;
  } else if (points.length === MIN_NUMBER_CITIES) {
    str = `${points[0].destination.name} ${MDASH} ${points[points.length - TWO].destination.name} ${MDASH} ${points[points.length - 1].destination.name}`;
  } else {
    str = '';
  }

  return str;
};

const createTripInfoMainTemplate = (points) => (
  `<div class="trip-info__main">
    <h1 class="trip-info__title">${renderCities(points)}</h1>
    <p class="trip-info__dates">${renderTimeInterval(points)}</p>
  </div>`
);

export default class TripInfoMain extends AbstractView {
  constructor(points) {
    super();
    this._points = points;
  }

  getTemplate() {
    return createTripInfoMainTemplate(this._points);
  }
}
