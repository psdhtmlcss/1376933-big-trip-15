import dayjs from 'dayjs';
import AbstractView from './abstract';
import {calcEventDuration} from '../utils/common';

const createTripPointOffers = (offers) => (
  `<li class="event__offer">
    <span class="event__offer-title">${offers.title}</span>
    &plus;&euro;&nbsp;
    <span class="event__offer-price">${offers.price}</span>
  </li>`
);

const renderEventDuration = (start, end) => {
  start = dayjs(start);
  end = dayjs(end);
  const eventDuration = end.diff(start, 'minutes');
  return calcEventDuration(eventDuration);
};

const createTripPointTemplate = (point) => {
  const renderOffers = () => {
    let str = '';
    point.offers.forEach((item) => {
      str += createTripPointOffers(item);
    });
    return str;
  };

  return `<li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime="${dayjs(point.dateFrom).format('YYYY-MM-DD')}">${dayjs(point.dateFrom).format('MMM D')}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${point.type}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${point.type} ${point.destination.name}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${point.dateFrom}">${dayjs(point.dateFrom).format('hh:mm')}</time>
          &mdash;
          <time class="event__end-time" datetime="${point.dateTo}">${dayjs(point.dateTo).format('hh:mm')}</time>
        </p>
        <p class="event__duration">${renderEventDuration(point.dateFrom, point.dateTo)}</p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${point.basePrice}</span>
      </p>
      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        ${point.offers ? renderOffers() : ''}
      </ul>
      <button class="event__favorite-btn ${point.isFavorite ? 'event__favorite-btn--active' : ''}" type="button">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>`;
};

export default class TripPointTemplate extends AbstractView {
  constructor(point) {
    super();
    this._point = point;
    this._editClickHandler = this._editClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
  }

  setEditClickHandler(callback) {
    this._callback.editClick = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._editClickHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector('.event__favorite-btn').addEventListener('click', this._favoriteClickHandler);
  }

  getTemplate() {
    return createTripPointTemplate(this._point);
  }

  _editClickHandler(evt) {
    evt.preventDefault();
    this._callback.editClick();
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }
}
