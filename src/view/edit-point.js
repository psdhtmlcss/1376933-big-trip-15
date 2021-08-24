import dayjs from 'dayjs';
import {destinations} from '../mock/destinations';
import {offers} from '../mock/offers';
import {TagNames} from '../const';
import SmartView from './smart';

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

const renderDescription = (city) => {
  const destination = destinations.find((item) => item.name === city);
  let container = '';
  if (destination.description || destination.pictures) {
    container = '<h3 class="event__section-title  event__section-title--destination">Destination</h3>';
  }
  if (destination.description) {
    container += `<p class="event__destination-description">${destination.description}</p>`;
  }
  if (destination.pictures) {
    let str = '';
    destination.pictures.forEach((picture) => {
      str += `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`;
    });
    container += `<div class="event__photos-container"><div class="event__photos-tape">${str}</div></div>`;
  }

  return container;
};

const createEditPointTemplate = (data) => (
  `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${data.type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>

              ${renderEventTypeList(data.type)}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${data.type}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${data.destination.name}" list="destination-list-1">
          <datalist id="destination-list-1">
            ${renderDestinationList()}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dayjs(data.date_from).format('DD/MM/YY hh:mm')}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dayjs(data.date_to).format('DD/MM/YY hh:mm')}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${data.base_price}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">
        <section class="event__section  event__section--offers">
          ${renderOffersSelectors(data.type, data.offers)}
        </section>
        <section class="event__section  event__section--destination">
          ${renderDescription(data.destination.name)}
        </section>
      </section>
    </form>
  </li>`
);

export default class EditPointTemplate extends SmartView {
  constructor(point) {
    super();
    this._data = EditPointTemplate.parsePointToData(point);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._closeEditPointHandler = this._closeEditPointHandler.bind(this);
    this._typeToggleHandler = this._typeToggleHandler.bind(this);
    this._cityToggleHandler = this._cityToggleHandler.bind(this);
    this._setInnerHandlers();
  }

  reset(point) {
    this.updateData(
      EditPointTemplate.parsePointToData(point),
    );
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setCloseEditPointHandler(this._callback.closeEditPoint);
  }

  _setInnerHandlers() {
    this.getElement().querySelector('.event__type-group').addEventListener('click', this._typeToggleHandler);
    this.getElement().querySelector('.event__input--destination').addEventListener('change', this._cityToggleHandler);
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(EditPointTemplate.parseDataToPoint(this._data));
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

  _typeToggleHandler(evt) {
    evt.preventDefault();
    if (evt.target.tagName !== TagNames.LABEL) {
      return;
    }
    this.updateData({
      type: evt.target.textContent,
      offers: null,
    });
  }

  _cityToggleHandler(evt) {
    evt.preventDefault();
    this.updateData({
      destination: {
        description: null,
        name: evt.target.value,
        pictures: null,
      },
    });
  }

  getTemplate() {
    return createEditPointTemplate(this._data);
  }

  static parsePointToData(point) {
    return Object.assign(
      {},
      point,
    );
  }

  static parseDataToPoint(data) {
    return Object.assign({}, data);
  }
}
