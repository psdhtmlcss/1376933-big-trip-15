import dayjs from 'dayjs';
import {destinations} from '../mock/destinations';
import {offers} from '../mock/offers';
import {TagName, TimeMetric} from '../const';
import SmartView from './smart';
import flatpickr from 'flatpickr';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';

const BLANK_POINT = {
  basePrice: 0,
  dateFrom: null,
  dateTo: null,
  destination: null,
  isFavorite: false,
  offers: null,
  type: Object.keys(offers)[0],
};

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
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${data.isDestination ? data.destination.name : ''}" list="destination-list-1">
          <datalist id="destination-list-1">
            ${renderDestinationList()}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${data.dateFrom ? dayjs(data.dateFrom).format('DD/MM/YY hh:mm') : dayjs(Date.now()).format('DD/MM/YY hh:mm')}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${data.dateTo ? dayjs(data.dateTo).format('DD/MM/YY hh:mm') : dayjs(Date.now()).add(1, 'hour').format('DD/MM/YY hh:mm')}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${data.basePrice}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit" ${data.isNewPoint && !data.isDestination ? 'disabled' : ''}>Save</button>
        <button class="event__reset-btn" type="reset">${data.isNewPoint ? 'Cancel' : 'Delete'}</button>
        ${data.isNewPoint ? '' : '<button class="event__rollup-btn" type="button"><span class="visually-hidden">Open event</span></button>'}

      </header>
      <section class="event__details">
        <section class="event__section  event__section--offers">
          ${renderOffersSelectors(data.type, data.offers)}
        </section>
        <section class="event__section  event__section--destination">
          ${data.isDestination ? renderDescription(data.destination.name) : ''}
        </section>
      </section>
    </form>
  </li>`
);

export default class EditPointTemplate extends SmartView {
  constructor(point = BLANK_POINT, isNewPoint = true) {
    super();
    this._data = EditPointTemplate.parsePointToData(point, isNewPoint);
    this._datePickerStart = null;
    this._datePickerEnd = null;
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._deletePointHandler = this._deletePointHandler.bind(this);
    this._closeEditPointHandler = this._closeEditPointHandler.bind(this);
    this._typeToggleHandler = this._typeToggleHandler.bind(this);
    this._cityToggleHandler = this._cityToggleHandler.bind(this);
    this._changeStartDataHandler = this._changeStartDataHandler.bind(this);
    this._changeEndDataHandler = this._changeEndDataHandler.bind(this);
    this._inputPriceHandler = this._inputPriceHandler.bind(this);
    this._offerChangeHandler = this._offerChangeHandler.bind(this);
    this._setInnerHandlers();
    this._setDatePickerStart();
    this._setDatePickerEnd();
  }

  reset(point) {
    this.updateData(
      EditPointTemplate.parsePointToData(point),
    );
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setDeletePointHandler(this._callback.deletePoint);
    this.setCloseEditPointHandler(this._callback.closeEditPoint);
    this._setDatePickerStart();
    this._setDatePickerEnd();
  }

  _setInnerHandlers() {
    this.getElement().querySelector('.event__type-group').addEventListener('click', this._typeToggleHandler);
    this.getElement().querySelector('.event__input--destination').addEventListener('change', this._cityToggleHandler);
    this.getElement().querySelector('.event__input--price').addEventListener('input', this._inputPriceHandler);
    if (this.getElement().querySelector('.event__available-offers')) {
      this.getElement().querySelector('.event__available-offers').addEventListener('change', this._offerChangeHandler);
    }
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this.updateData({
      dateFrom: this._data.dateFrom ? this._data.dateFrom : dayjs(this.getElement().querySelector('#event-start-time-1').value).toISOString(),
      dateTo: this._data.dateTo ? this._data.dateTo : dayjs(this.getElement().querySelector('#event-end-time-1').value).toISOString(),
    });
    this._callback.formSubmit(EditPointTemplate.parseDataToPoint(this._data));
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector('form').addEventListener('submit', this._formSubmitHandler);
  }

  _deletePointHandler(evt) {
    evt.preventDefault();
    this._callback.deletePoint();
  }

  setDeletePointHandler(callback) {
    this._callback.deletePoint = callback;
    this.getElement().querySelector('.event__reset-btn').addEventListener('click', this._deletePointHandler);
  }

  _closeEditPointHandler(evt) {
    evt.preventDefault();
    this._callback.closeEditPoint();
  }

  setCloseEditPointHandler(callback) {
    if (this.getElement().querySelector('.event__rollup-btn')) {
      this._callback.closeEditPoint = callback;
      this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._closeEditPointHandler);
    }
  }

  _typeToggleHandler(evt) {
    evt.preventDefault();
    if (evt.target.tagName !== TagName.LABEL) {
      return;
    }
    this.updateData({
      type: evt.target.textContent,
      offers: null,
    });
  }

  _cityToggleHandler(evt) {
    evt.preventDefault();
    if (destinations.find((destination) => destination.name === evt.target.value)) {
      this.updateData({
        destination: {
          description: null,
          name: evt.target.value,
          pictures: null,
        },
        isDestination: true,
      });
      this.getElement().querySelector('.event__save-btn').disabled = false;
    } else {
      this.getElement().querySelector('.event__save-btn').disabled = true;
    }
  }

  _changeStartDataHandler([userDate]) {
    this._datePickerEnd.set('minDate', Date.parse(userDate) + TimeMetric.MS_IN_HOURSE);
    this.getElement().querySelector('#event-end-time-1').value = dayjs(userDate).add(1, 'hour').format('DD/MM/YY hh:mm');
    this._datePickerStart.close();
    this.updateData({
      dateFrom: dayjs(userDate).toISOString(),
      dateTo: dayjs(userDate).add(1, 'hour').toISOString(),
    }, true);
  }

  _setDatePickerStart() {
    if (this._datePickerStart) {
      this._datePickerStart.destroy();
      this._datePickerStart = null;
    }

    this._datePickerStart = flatpickr(this.getElement().querySelector('#event-start-time-1'), {
      enableTime: true,
      minDate: 'today',
      dateFormat: 'd/m/y H:i',
      onChange: this._changeStartDataHandler,
    });
  }

  _changeEndDataHandler([userDate]) {
    if (Date.parse(userDate) <= Date.parse(this._data.dateFrom)) {
      this._datePickerEnd.set('minDate', Date.parse(this._data.dateFrom) + TimeMetric.MS_IN_HOURSE);
      this.getElement().querySelector('#event-end-time-1').value = dayjs(userDate).add(1, 'hour').format('DD/MM/YY hh:mm');
    }
    this._datePickerEnd.close();
    this.updateData({
      dateTo: dayjs(userDate).toISOString(),
    }, true);
  }

  _setDatePickerEnd() {
    if (this._datePickerEnd) {
      this._datePickerEnd.destroy();
      this._datePickerEnd = null;
    }

    this._datePickerEnd = flatpickr(this.getElement().querySelector('#event-end-time-1'), {
      enableTime: true,
      minDate: 'today',
      dateFormat: 'd/m/y H:i',
      onChange: this._changeEndDataHandler,
    });
  }

  _inputPriceHandler(evt) {
    evt.preventDefault();
    const regexp = /\D/g;
    evt.target.value = evt.target.value.replace(regexp, '');
    this.updateData(
      {
        basePrice: evt.target.value,
      },
      true,
    );
  }

  _offerChangeHandler(evt) {
    evt.preventDefault();
    let selectedOffers;
    if (this._data.offers !== null) {
      selectedOffers = this._data.offers.slice();
    } else {
      selectedOffers = [];
    }
    const currentTarget = {
      title: evt.target.nextElementSibling.querySelector('.event__offer-title').textContent,
      price: +(evt.target.nextElementSibling.querySelector('.event__offer-price').textContent),
    };
    const indexElement = selectedOffers.findIndex((item) => item.title === currentTarget.title);
    if (indexElement === -1) {
      selectedOffers.push(currentTarget);
    } else {
      selectedOffers.splice(indexElement, 1);
    }

    this.updateData(
      {
        offers: selectedOffers,
      },
    );
  }

  getTemplate() {
    return createEditPointTemplate(this._data);
  }

  static parsePointToData(point, isNewPoint) {
    return Object.assign(
      {},
      point,
      {
        isDestination: point.destination !== null,
        isNewPoint: isNewPoint,
      },
    );
  }

  static parseDataToPoint(data) {
    data = Object.assign({}, data);

    delete data.isDestination;
    delete data.isNewPoint;

    return data;
  }
}
