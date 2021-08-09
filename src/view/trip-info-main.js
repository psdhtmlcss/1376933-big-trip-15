import {createElement} from '../utils';

const createTripInfoMainTemplate = () => (
  `<div class="trip-info__main">
    <h1 class="trip-info__title">Amsterdam &mdash; Chamonix &mdash; Geneva</h1>
    <p class="trip-info__dates">Mar 18&nbsp;&mdash;&nbsp;20</p>
  </div>`
);

export default class TripInfoMainTemplate {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createTripInfoMainTemplate();
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
