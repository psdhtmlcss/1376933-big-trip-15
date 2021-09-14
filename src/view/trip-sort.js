import AbstractView from './abstract';

const renderSortItems = (sorts, currentSortType) => {
  let str = '';
  sorts.forEach((item) => {
    str += `<div class="trip-sort__item  trip-sort__item--${item.name.toLowerCase()}">
      <input id="${item.type}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="${item.type}" ${currentSortType === item.type ? 'checked' : ''} ${item.isDisabled ? 'disabled' : ''}>
        <label class="trip-sort__btn" for="${item.type}">${item.name}</label>
    </div>`;
  });

  return str;
};

const createTripSortTemplate = (sorts, currentSortType) => (
  `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">${renderSortItems(sorts, currentSortType)}</form>`
);

export default class SortTemplate extends AbstractView {
  constructor(sorts, currentSortType) {
    super();
    this._sorts = sorts,
    this._currentSortType = currentSortType;
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortChange = callback;
    this.getElement().addEventListener('change', this._sortTypeChangeHandler);
  }

  getTemplate() {
    return createTripSortTemplate(this._sorts, this._currentSortType);
  }

  _sortTypeChangeHandler(evt) {
    if (evt.target.id === this._currentSortType) {
      return;
    }
    this._callback.sortChange(evt.target.id);
  }
}
