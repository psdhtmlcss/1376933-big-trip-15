import AbstractView from './abstract';
import {TagName} from '../const';

const renderFilterItems = (filters, currentFilter) => {
  let str = '';
  filters.forEach((filter) => {
    str += `<div class="trip-filters__filter">
      <input id="${filter.type}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filter.name.toLowerCase()}" ${currentFilter === filter.type ? 'checked' : ''}>
      <label class="trip-filters__filter-label" for="${filter.type}">${filter.name}</label>
    </div>`;
  });
  return str;
};

const createTripFiltersTemplate = (filters, currentFilter) => (
  `<form class="trip-filters" action="#" method="get">
    ${renderFilterItems(filters, currentFilter)}
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`
);

export default class FilterTemplate extends AbstractView {
  constructor(filters, currentFilter) {
    super();
    this._filters = filters;
    this._currentFilter = currentFilter;
    this._filterClickHandler = this._filterClickHandler.bind(this);
  }

  _filterClickHandler(evt) {
    if (evt.target.tagName !== TagName.LABEL) {
      return;
    }
    this._callback.filterClick(evt.target.htmlFor);
  }

  setFilterChangeHandler(callback) {
    this._callback.filterClick = callback;
    this.getElement().addEventListener('click', this._filterClickHandler);
  }

  getTemplate() {
    return createTripFiltersTemplate(this._filters, this._currentFilter);
  }
}
