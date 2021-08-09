import {createElement} from '../utils';

const createTripTotalCostTemplate = () => (
  `<p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">1230</span>
  </p>`
);

export default class TripTotalCostTemplate {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createTripTotalCostTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  returnElement() {
    this._element = null;
  }
}
