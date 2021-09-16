import dayjs from 'dayjs';
import {TagName, TimeMetric, SHAKE_ANIMATION_TIMEOUT} from '../const';
import SmartView from './smart';
import flatpickr from 'flatpickr';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';

const BLANK_POINT = {
  basePrice: 0,
  dateFrom: null,
  dateTo: null,
  destination: null,
  isFavorite: false,
  offers: [],
  type: null,
};

const createOffersStructure = (items) => items.reduce((acc, current) => Object.assign({}, acc, { [current.type]: current.offers }), {});

const renderEventTypeList = (selectedType, offers, isDisabled) => {
  const types = offers.map((item) => Object.values(item)[0]);
  let str = '';
  types.forEach((type, index) => {
    str += `<div class="event__type-item">
        <input id="event-type-${type}-${index}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${selectedType === type ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
        <label class="event__type-label  event__type-label--${type}" for="event-type-${index}">${type}</label>
      </div>`;
  });
  return str;
};

const renderDestinationList = (destinations, isDisabled) => {
  let str = '';
  destinations.forEach((item) => {
    str += `<option value="${item['name']}" ${isDisabled ? 'disabled' : ''}></option>`;
  });
  return str;
};

const renderOffersSelectors = (type, selectedOffers, offers, isDisabled) => {
  const offersStructure = createOffersStructure(offers);
  const currentType = offersStructure[type];
  let str = '';
  let activeSelector = '';
  if (currentType.length > 0) {
    currentType.forEach((item) => {
      const title = item.title.split(' ').join('-').toLowerCase();
      if (selectedOffers) {
        activeSelector = selectedOffers.find((element) => element.title === item.title) ? 'checked' : '';
      }
      str += `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${title}-1" type="checkbox" name="event-offer-${title}" ${activeSelector} ${isDisabled ? 'disabled' : ''}>
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

const renderDescription = (city, destinations) => {
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

const renderDeleteButton = (isNewPoint, isDeleting, isDisabled) => {
  let str = '';
  if (isNewPoint) {
    str = `<button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>Cancel</button>`;
  } else {
    str = `<button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>${isDeleting ? 'Deleting...' : 'Delete'}</button>`;
  }

  return str;
};

const renderRollupButton = (isNewPoint, isDisabled) => {
  let str = '';
  if (isNewPoint) {
    str = '';
  } else {
    str = `<button class="event__rollup-btn" type="button" ${isDisabled ? 'disabled' : ''}><span class="visually-hidden">Open event</span></button>`;
  }

  return str;
};

const createEditPointTemplate = (data, destinations, offers) => (
  `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${data.type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${data.isDisabled ? 'disabled' : ''}>

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>

              ${renderEventTypeList(data.type, offers, data.isDisabled)}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${data.type}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${data.isDestination ? data.destination.name : ''}" list="destination-list-1" ${data.isDisabled ? 'disabled' : ''}>
          <datalist id="destination-list-1">
            ${renderDestinationList(destinations, data.isDisabled)}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" data-time-start="${data.dateFrom ? data.dateFrom : dayjs(Date.now()).toISOString()}" value="${data.dateFrom ? dayjs(data.dateFrom).format('DD/MM/YY hh:mm') : dayjs(Date.now()).format('DD/MM/YY hh:mm')}" ${data.isDisabled ? 'disabled' : ''}>
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" data-time-end="${data.dateTo ? data.dateTo : dayjs(Date.now()).add(1, 'hour').toISOString()}" value="${data.dateTo ? dayjs(data.dateTo).format('DD/MM/YY hh:mm') : dayjs(Date.now()).add(1, 'hour').format('DD/MM/YY hh:mm')}" ${data.isDisabled ? 'disabled' : ''}>
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${data.basePrice}" ${data.isDisabled ? 'disabled' : ''}>
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit" ${data.isNewPoint && !data.isDestination || data.isDisabled ? 'disabled' : ''}>${data.isSaving ? 'Saving...' : 'Save'}</button>
        ${renderDeleteButton(data.isNewPoint, data.isDeleting, data.isDisabled)}
        ${renderRollupButton(data.isNewPoint, data.isDisabled)}

      </header>
      <section class="event__details">
        <section class="event__section  event__section--offers">
          ${renderOffersSelectors(data.type, data.offers, offers, data.isDisabled)}
        </section>
        <section class="event__section  event__section--destination">
          ${data.isDestination ? renderDescription(data.destination.name, destinations) : ''}
        </section>
      </section>
    </form>
  </li>`
);

export default class EditPoint extends SmartView {
  constructor(point = BLANK_POINT, isNewPoint, destinations, offers) {
    super();
    this._data = EditPoint.parsePointToData(point, isNewPoint, offers);
    this._datePickerStart = null;
    this._datePickerEnd = null;
    this._destinations = destinations;
    this._offers = offers;
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
      EditPoint.parsePointToData(point),
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

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector('form').addEventListener('submit', this._formSubmitHandler);
  }

  setDeletePointHandler(callback) {
    this._callback.deletePoint = callback;
    this.getElement().querySelector('.event__reset-btn').addEventListener('click', this._deletePointHandler);
  }

  setCloseEditPointHandler(callback) {
    if (this.getElement().querySelector('.event__rollup-btn')) {
      this._callback.closeEditPoint = callback;
      this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._closeEditPointHandler);
    }
  }

  getTemplate() {
    return createEditPointTemplate(this._data, this._destinations, this._offers);
  }

  _setInnerHandlers() {
    this.getElement().querySelector('.event__type-group').addEventListener('click', this._typeToggleHandler);
    this.getElement().querySelector('.event__input--destination').addEventListener('input', this._cityToggleHandler);
    this.getElement().querySelector('.event__input--price').addEventListener('input', this._inputPriceHandler);
    if (this.getElement().querySelector('.event__available-offers')) {
      this.getElement().querySelector('.event__available-offers').addEventListener('change', this._offerChangeHandler);
    }
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this.updateData({
      dateFrom: this._data.dateFrom ? this._data.dateFrom : dayjs(Date.now()).toISOString(),
      dateTo: this._data.dateTo ? this._data.dateTo : dayjs(Date.now()).add(1, 'hour').toISOString(),
    });
    this._callback.formSubmit(EditPoint.parseDataToPoint(this._data));
  }

  _deletePointHandler(evt) {
    evt.preventDefault();
    this._callback.deletePoint();
  }

  _closeEditPointHandler(evt) {
    evt.preventDefault();
    this._callback.closeEditPoint();
  }

  _typeToggleHandler(evt) {
    evt.preventDefault();
    if (evt.target.tagName !== TagName.LABEL) {
      return;
    }
    this.updateData({
      type: evt.target.textContent,
      offers: [],
    });
  }

  _cityToggleHandler(evt) {
    const currentDestination = this._destinations.find((destination) => destination.name === evt.target.value);
    evt.preventDefault();
    if (currentDestination) {
      this.updateData({
        destination: {
          description: currentDestination.description ? currentDestination.description : '',
          name: currentDestination.name,
          pictures: currentDestination.pictures.length ? currentDestination.pictures : [],
        },
        isDestination: true,
      });
      this.getElement().querySelector('.event__save-btn').disabled = false;
    } else {
      this.getElement().querySelector('.event__save-btn').disabled = true;
    }
  }

  _changeStartDataHandler(selectedDay) {
    this._datePickerStart.input.value = dayjs(selectedDay[0]).format('DD/MM/YY hh:mm');
    this._datePickerEnd.setDate(Date.parse(selectedDay[0]) + TimeMetric.MS_IN_HOURS);
    this._datePickerEnd.input.value = dayjs(Date.parse(selectedDay[0]) + TimeMetric.MS_IN_HOURS).format('DD/MM/YY hh:mm');
    this._datePickerStart.close();
    this.updateData({
      dateFrom: dayjs(selectedDay[0]).toISOString(),
      dateTo: dayjs(selectedDay[0]).add(1, 'hour').toISOString(),
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

  _changeEndDataHandler(selectedDay) {
    if (Date.parse(selectedDay) <= Date.parse(this._data.dateFrom)) {
      this._datePickerEnd.setDate(Date.parse(this._data.dateFrom) + TimeMetric.MS_IN_HOURS);
      this._datePickerEnd.input.value = dayjs(Date.parse(this._data.dateFrom) + TimeMetric.MS_IN_HOURS).format('DD/MM/YY hh:mm');
      this.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / TimeMetric.MS_IN_SECOND}s`;
      setTimeout(() => {
        this.getElement().style.animation = '';
      }, SHAKE_ANIMATION_TIMEOUT);
      return;
    }
    this._datePickerEnd.close();
    this.updateData({
      dateTo: dayjs(selectedDay).toISOString(),
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
        basePrice: Number(evt.target.value),
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

  static parsePointToData(point, isNewPoint, offers) {
    return Object.assign(
      {},
      point,
      {
        isDestination: point.destination !== null,
        isNewPoint: isNewPoint,
        type: isNewPoint ? offers[0].type : point.type,
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      },
    );
  }

  static parseDataToPoint(data) {
    data = Object.assign({}, data);

    delete data.isDestination;
    delete data.isNewPoint;
    delete data.isDisabled;
    delete data.isSaving;
    delete data.isDeleting;

    return data;
  }
}
