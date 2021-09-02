import FilterTemplateView from '../view/trip-filter';
import {render, RenderPosition, replace, remove} from '../utils/render';
import {filters, UpdateType} from '../const';

export default class Filter {
  constructor(filterContainer, filterModel, pointsModel) {
    this._filterModel = filterModel;
    this._pointsModel = pointsModel;
    this._filterContainer = filterContainer;
    this._filterComponent = null;
    this._handleFilterChange = this._handleFilterChange.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    const prevFilterComponent = this._filterComponent;

    this._filterComponent = new FilterTemplateView(filters, this._filterModel.getFilter());
    this._filterComponent.setFilterChangeHandler(this._handleFilterChange);

    if (prevFilterComponent === null) {
      render(this._filterContainer, this._filterComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this._filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  _handleFilterChange(type) {
    if (this._filterModel.getFilter() === type) {
      return;
    }

    this._filterModel.setFilter(UpdateType.MAJOR, type);
  }

  _handleModelEvent() {
    this.init();
  }
}
