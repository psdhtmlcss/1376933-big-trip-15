import SortTemplateView from '../view/trip-sort';
import TripListTemplateView from '../view/trip-list';
import MessagesTemplateView from '../view/messages';
import PointPresenter from './point';

import {render, RenderPosition} from '../utils/render';


export default class Trip {
  constructor(tripContainer) {
    this._tripContainer = tripContainer;
    this._sortComponent = new SortTemplateView();
    this._tripListComponent = new TripListTemplateView();
    this._noPointsComponent = new MessagesTemplateView();
  }

  init(points) {
    this._points = points.slice();
    this._renderPoints(points);
  }

  _renderSort() {
    render(this._tripContainer, this._sortComponent, RenderPosition.BEFOREEND);
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
    const pointPresenter = new PointPresenter(this._tripListComponent);
    pointPresenter.init(point);
  }

  _renderMessages() {
    render(this._tripContainer, this._noPointsComponent, RenderPosition.BEFOREEND);
  }
}
