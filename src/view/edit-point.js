import dayjs from 'dayjs';
import {destinations} from '../mock/destinations';
import {offers} from '../mock/offers';
import AbstractView from './abstract';

const renderEventTypeList = (selectedType) => {
  let str = '';
  Object.keys(offers).forEach((type) => {
    str += `<div class="event__type-item">
        <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${selectedType === type ? 'checked' : ''}>
        <label class="event__type-label  event__type-label--${type}" for="event-type-taxi-1">${type}</label>
      </div>`;
  });
  return str;
};

const renderDestinationList = () => {
  let str = '';
  destinations.forEach((item) => {
    str += `<option value="${item['name']}"></option>`;
  });
  return str;
};

const renderOffersSelectors = (type, selectedOffers) => {
  let str = '';
  let activeSelector = '';
  if (offers[type].length > 0) {
    offers[type].forEach((item) => {
      const title = item.title.split(' ').join('-').toLowerCase();
      if (selectedOffers) {
        activeSelector = selectedOffers.find((element) => element.title === item.title) ? 'checked' : '';
      }
      str += `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${title}-1" type="checkbox" name="event-offer-${title}" ${activeSelector}>
        <label class="event__offer-label" for="event-offer-${title}-1">
          <span class="event__offer-title">${item.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${item.price}</span>
        </label>
      </div>`;
    });

    return `<h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">${str}</div>`;
  } else {
    return str;
  }
};

const renderDestination = (city) => {
  const destination = destinations.find((item) => item.name === city);
  if (destination.description) {
    return `<h3 class="event__section-title  event__section-title--destination">Destination</h3>
    <p class="event__destination-description">${destination.description}</p>`;
  } else {
    return '';
  }
};

const createEditPointTemplate = (point) => (
  `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${point.type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>

              ${renderEventTypeList(point.type)}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${point.type}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${point.destination.name}" list="destination-list-1">
          <datalist id="destination-list-1">
            ${renderDestinationList()}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dayjs(point.date_from).format('DD/MM/YY hh:mm')}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dayjs(point.date_to).format('DD/MM/YY hh:mm')}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${point.base_price}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">
        <section class="event__section  event__section--offers">
          ${renderOffersSelectors(point.type, point.offers)}
        </section>
        <section class="event__section  event__section--destination">
          ${renderDestination(point.destination.name)}
        </section>
      </section>
    </form>
  </li>`
);

export default class EditPointTemplate extends AbstractView {
  constructor(point) {
    super();
    this._point = point;
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._closeEditPointHandler = this._closeEditPointHandler.bind(this);
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit();
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector('form').addEventListener('submit', this._formSubmitHandler);
  }

  _closeEditPointHandler(evt) {
    evt.preventDefault();
    this._callback.closeEditPoint();
  }

  setCloseEditPointHandler(callback) {
    this._callback.closeEditPoint = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._closeEditPointHandler);
  }

  getTemplate() {
    return createEditPointTemplate(this._point);
  }
}
