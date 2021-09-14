import AbstractView from './abstract';
import {TagName} from '../const';
import {filter} from '../utils/filter';

const renderFilterItems = (filterTypes, currentFilter, points) => {
  let str = '';
  filterTypes.forEach((filterType) => {
    str += `<div class="trip-filters__filter">
      <input id="${filterType.type}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filterType.name.toLowerCase()}" ${currentFilter === filterType.type ? 'checked' : ''} ${filter[filterType.type](points).length ? '' : 'disabled'}>
      <label class="trip-filters__filter-label" for="${filterType.type}">${filterType.name}</label>
    </div>`;
  });
  return str;
};

const createTripFiltersTemplate = (filters, currentFilter, points) => (
  `<form class="trip-filters" action="#" method="get">
    ${renderFilterItems(filters, currentFilter, points)}
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`
);

export default class FilterTemplate extends AbstractView {
  constructor(filters, currentFilter, points) {
    super();
    this._filters = filters;
    this._currentFilter = currentFilter;
    this._points = points.getPoints();
    this._filterClickHandler = this._filterClickHandler.bind(this);
  }

  setFilterChangeHandler(callback) {
    this._callback.filterClick = callback;
    this.getElement().addEventListener('click', this._filterClickHandler);
  }

  getTemplate() {
    return createTripFiltersTemplate(this._filters, this._currentFilter, this._points);
  }

  _filterClickHandler(evt) {
    if (evt.target.tagName !== TagName.LABEL || evt.target.previousElementSibling.disabled) {
      return;
    }
    this._callback.filterClick(evt.target.htmlFor);
  }
}
