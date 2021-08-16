import TripPointTemplateView from '../view/trip-point';
import EditPointTemplateView from '../view/edit-point';
import {render, RenderPosition, replace} from '../utils/render';

const Keys = {
  ESCAPE_KEY: ['Escape', 'Esc'],
};

export default class Point {
  constructor(tripListContainer) {
    this._tripListContainer = tripListContainer;
    this._pointComponent = null;
    this._editPointComponent = null;
    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleCloseEditPoint = this._handleCloseEditPoint.bind(this);
    this._escKeyDownHandle = this._escKeyDownHandle.bind(this);
  }

  init(point) {
    this._pointComponent = new TripPointTemplateView(point);
    this._editPointComponent = new EditPointTemplateView(point);

    render(this._tripListContainer, this._pointComponent, RenderPosition.BEFOREEND);

    this._pointComponent.setEditClickHandler(this._handleEditClick);
    this._editPointComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._editPointComponent.setCloseEditPointHandler(this._handleCloseEditPoint);
  }

  _replacePointToForm() {
    replace(this._editPointComponent, this._pointComponent);
    document.addEventListener('keydown', this._escKeyDownHandle);
  }

  _replaceFormToPoint() {
    replace(this._pointComponent, this._editPointComponent);
    document.removeEventListener('keydown', this._escKeyDownHandle);
  }

  _handleEditClick() {
    this._replacePointToForm();
  }

  _handleFormSubmit() {
    this._replaceFormToPoint();
  }

  _handleCloseEditPoint() {
    this._replaceFormToPoint();
  }

  _escKeyDownHandle(evt) {
    if (Keys.ESCAPE_KEY.includes(evt.key)) {
      evt.preventDefault();
      this._replaceFormToPoint();
      document.removeEventListener('keydown', this._escKeyDownHandle);
    }
  }
}
