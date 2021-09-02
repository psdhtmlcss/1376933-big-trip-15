import SortTemplateView from '../view/trip-sort';
import TripListTemplateView from '../view/trip-list';
import MessagesTemplateView from '../view/messages';
import PointPresenter from './point';
import NewPointPresenter from './new-point';
import {render, RenderPosition, remove} from '../utils/render';
import {sortType} from '../utils/sort';
import {SortType, sorts, UserAction, UpdateType, FilterType} from '../const';
import {filter} from '../utils/filter';


export default class Trip {
  constructor(tripContainer, pointsModel, filterModel) {
    this._tripContainer = tripContainer;
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;
    this._pointPresenter = new Map();
    this._currentSortType = SortType.DAY;
    this._filterType = FilterType.EVERYTHING;
    this._sortComponent = null;
    this._tripListComponent = new TripListTemplateView();
    this._noPointsComponent = null;

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortChange = this._handleSortChange.bind(this);

    this._newPointPresenter = new NewPointPresenter(this._tripListComponent, this._handleViewAction);
  }

  init() {
    this._renderPoints(this._getPoints());
    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  destroy() {
    this._clearTripList({resetSortType: true});
    this._pointsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
  }

  createNewPoint(callback) {
    this._newPointPresenter.init(callback);
  }

  _getPoints() {
    const points = this._pointsModel.points;
    this._filterType = this._filterModel.getFilter();
    const filteredPoints = filter[this._filterType](points);
    sortType[this._currentSortType](filteredPoints);
    return filteredPoints;
  }

  _handleViewAction(actionType, updateType, update) {
    switch(actionType) {
      case UserAction.UPDATE_POINT:
        this._pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this._pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this._pointsModel.deletePoint(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch(updateType) {
      case UpdateType.PATCH:
        this._pointPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this._clearTripList();
        this._renderPoints(this._getPoints());
        break;
      case UpdateType.MAJOR:
        this._clearTripList({resetSortType: true});
        this._renderPoints(this._getPoints());
        break;
    }
  }

  _handleModeChange() {
    this._newPointPresenter.destroy();
    this._pointPresenter.forEach((presenter) => presenter.resetView());
  }

  _handleSortChange(type) {
    this._currentSortType = type;
    this._clearTripList();
    this._renderPoints(this._getPoints());
  }

  _renderSort() {
    this._sortComponent = new SortTemplateView(sorts, this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortChange);

    render(this._tripContainer, this._sortComponent, RenderPosition.BEFOREEND);
  }

  _clearTripList({resetSortType = false} = {}) {
    this._pointPresenter.forEach((presenter) => presenter.destroy());
    this._pointPresenter.clear();

    if (this._sortComponent !== null) {
      remove(this._sortComponent);
    }
    if (this._noPointsComponent !== null) {
      remove(this._noPointsComponent);
    }


    if (resetSortType) {
      this._currentSortType = SortType.DAY;
    }
  }

  _renderTripList() {
    render(this._tripContainer, this._tripListComponent, RenderPosition.BEFOREEND);
  }

  _renderPoints(points) {
    if (points.length === 0) {
      this._renderMessages();
      return;
    }

    this._renderSort();
    this._renderTripList();
    for (let i = 0; i < points.length; i++) {
      this._renderPoint(points[i]);
    }
  }

  _renderPoint(point) {
    const pointPresenter = new PointPresenter(this._tripListComponent, this._handleViewAction, this._handleModeChange);
    pointPresenter.init(point);
    this._pointPresenter.set(point.id, pointPresenter);
  }

  _renderMessages() {
    this._noPointsComponent = new MessagesTemplateView(this._filterType);
    render(this._tripContainer, this._noPointsComponent, RenderPosition.BEFOREEND);
  }
}
