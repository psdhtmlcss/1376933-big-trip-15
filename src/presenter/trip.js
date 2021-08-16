import SortTemplateView from '../view/trip-sort';
import TripListTemplateView from '../view/trip-list';
import MessagesTemplateView from '../view/messages';
import PointPresenter from './point';
import {updateItem} from '../utils/common.js';
import {render, RenderPosition} from '../utils/render';


export default class Trip {
  constructor(tripContainer) {
    this._tripContainer = tripContainer;
    this._pointPresenter = new Map();
    this._sortComponent = new SortTemplateView();
    this._tripListComponent = new TripListTemplateView();
    this._noPointsComponent = new MessagesTemplateView();

    this._handlePointChange = this._handlePointChange.bind(this);
  }

  init(points) {
    this._points = points.slice();
    this._renderPoints(points);
  }

  _handlePointChange(updatedPoint) {
    this._points = updateItem(this._points, updatedPoint);
    this._pointPresenter.get(updatedPoint.id).init(updatedPoint);
  }

  _renderSort() {
    render(this._tripContainer, this._sortComponent, RenderPosition.BEFOREEND);
  }

  _clearTripList() {
    this._pointPresenter.forEach((presenter) => presenter.destroy());
    this._pointPresenter.clear();
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
    const pointPresenter = new PointPresenter(this._tripListComponent, this._handlePointChange);
    pointPresenter.init(point);
    this._pointPresenter.set(point.id, pointPresenter);
  }

  _renderMessages() {
    render(this._tripContainer, this._noPointsComponent, RenderPosition.BEFOREEND);
  }
}
