import TripTemplateView from '../view/trip';
import SortTemplateView from '../view/trip-sort';
import TripListTemplateView from '../view/trip-list';
import MessagesTemplateView from '../view/messages';
import LoadingView from '../view/loading';
import PointPresenter, {State as PointPresenterViewState} from './point';
import NewPointPresenter from './new-point';
import {render, RenderPosition, remove} from '../utils/render';
import {sortType} from '../utils/sort';
import {SortType, sorts, UserAction, UpdateType, FilterType} from '../const';
import {filter} from '../utils/filter';


export default class Trip {
  constructor(tripContainer, pointsModel, filterModel, destinationsModel, offersModel, api) {
    this._tripContainer = tripContainer;
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;
    this._destinationsModel = destinationsModel;
    this._offersModel = offersModel;
    this._api = api;
    this._pointPresenter = new Map();
    this._currentSortType = SortType.DAY;
    this._filterType = FilterType.EVERYTHING;
    this._sortComponent = null;
    this._noPointsComponent = null;
    this._isLoading = true;
    this._destinations = null;
    this._offers = null;

    this._tripComponent = new TripTemplateView();
    this._loadingComponent = new LoadingView();
    this._tripListComponent = new TripListTemplateView();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortChange = this._handleSortChange.bind(this);

    this._newPointPresenter = null;
  }

  init() {
    render(this._tripContainer, this._tripComponent, RenderPosition.AFTERBEGIN);
    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
    if (this._isLoading) {
      this._renderLoading();
      return;
    }
    this._renderPoints(this._getPoints());
  }

  destroy() {
    this._clearTripList({resetSortType: true});
    this._pointsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
  }

  createNewPoint(callback) {
    if (this._newPointPresenter !== null) {
      this._newPointPresenter.destroy();
    }
    if (this._noPointsComponent !== null) {
      remove(this._noPointsComponent);
    }
    this._newPointPresenter = new NewPointPresenter(this._tripListComponent, this._handleViewAction, this._destinations, this._offers);
    this._newPointPresenter.init(callback);
  }

  _getPoints() {
    const points = this._pointsModel.getPoints();
    this._filterType = this._filterModel.getFilter();
    const filteredPoints = filter[this._filterType](points);
    sortType[this._currentSortType](filteredPoints);
    return filteredPoints;
  }

  _handleViewAction(actionType, updateType, update) {
    switch(actionType) {
      case UserAction.UPDATE_POINT:
        this._pointPresenter.get(update.id).setViewState(PointPresenterViewState.SAVING);
        this._api.updatePoint(update).then((response) => {
          this._pointsModel.updatePoint(updateType, response);
        })
          .catch(() => {
            this._pointPresenter.get(update.id).setViewState(PointPresenterViewState.ABORTING);
          });
        break;
      case UserAction.ADD_POINT:
        this._newPointPresenter.setSaving();
        this._api.addPoint(update).then((response) => {
          this._pointsModel.addPoint(updateType, response);
        })
          .catch(() => {
            this._newPointPresenter.setAborting();
          });
        break;
      case UserAction.DELETE_POINT:
        this._pointPresenter.get(update.id).setViewState(PointPresenterViewState.DELETING);
        this._api.deletePoint(update).then(() => {
          this._pointsModel.deletePoint(updateType, update);
        })
          .catch(() => {
            this._pointPresenter.get(update.id).setViewState(PointPresenterViewState.ABORTING);
          });
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
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._destinations = this._destinationsModel.destinations;
        this._offers = this._offersModel.offers;
        this._renderPoints(this._getPoints());
        break;
    }
  }

  _handleModeChange() {
    if (this._newPointPresenter !== null) {
      this._newPointPresenter.destroy();
    }
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

    render(this._tripComponent, this._sortComponent, RenderPosition.AFTERBEGIN);
  }

  _clearTripList({resetSortType = false} = {}) {
    if (this._newPointPresenter !== null) {
      this._newPointPresenter.destroy();
    }
    this._pointPresenter.forEach((presenter) => presenter.destroy());
    this._pointPresenter.clear();

    if(this._loadingComponent) {
      remove(this._loadingComponent);
    }
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
    render(this._tripComponent, this._tripListComponent, RenderPosition.BEFOREEND);
  }

  _renderPoints(points) {
    this._renderTripList();
    if (points.length === 0) {
      this._renderMessages();
      return;
    }

    this._renderSort();
    for (let i = 0; i < points.length; i++) {
      this._renderPoint(points[i]);
    }
  }

  _renderPoint(point) {
    const pointPresenter = new PointPresenter(this._tripListComponent, this._handleViewAction, this._handleModeChange, this._destinations, this._offers);
    pointPresenter.init(point);
    this._pointPresenter.set(point.id, pointPresenter);
  }

  _renderMessages() {
    this._noPointsComponent = new MessagesTemplateView(this._filterType);
    render(this._tripComponent, this._noPointsComponent, RenderPosition.BEFOREEND);
  }

  _renderLoading() {
    render(this._tripComponent, this._loadingComponent, RenderPosition.BEFOREEND);
  }
}
