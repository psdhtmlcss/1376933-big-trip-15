import AbstractView from './abstract';
import {TagName} from '../const';

const createSiteMenuTemplate = () => (
  `<nav class="trip-controls__trip-tabs  trip-tabs">
    <a class="trip-tabs__btn  trip-tabs__btn--active" href="#">Table</a>
    <a class="trip-tabs__btn" href="#">Stats</a>
  </nav>`
);

export default class SiteMenuTemplate extends AbstractView {
  constructor() {
    super();
    this._toggleScreenClickHandler = this._toggleScreenClickHandler.bind(this);
  }

  setToggleScreenClickHandler(callback) {
    this._callback.toggleScreen = callback;
    this.getElement().addEventListener('click', this._toggleScreenClickHandler);
  }

  getTemplate() {
    return createSiteMenuTemplate();
  }

  _toggleScreenClickHandler(evt) {
    evt.preventDefault();
    if (evt.target.tagName !== TagName.ANCHOR || evt.target.classList.contains('trip-tabs__btn--active')) {
      return;
    }
    this.getElement().querySelector('.trip-tabs__btn--active').classList.remove('trip-tabs__btn--active');
    evt.target.classList.add('trip-tabs__btn--active');
    this._callback.toggleScreen(evt.target.textContent);
  }
}


