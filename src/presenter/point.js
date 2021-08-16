import TripPointTemplateView from '../view/trip-point';
import EditPointTemplateView from '../view/edit-point';
import {render, RenderPosition, replace, remove} from '../utils/render';

const Keys = {
  ESCAPE_KEY: ['Escape', 'Esc'],
};

export default class Point {
  constructor(tripListContainer, changeData) {
    this._tripListContainer = tripListContainer;
    this._changeData = changeData;
    this._pointComponent = null;
    this._editPointComponent = null;
    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleCloseEditPoint = this._handleCloseEditPoint.bind(this);
    this._escKeyDownHandle = this._escKeyDownHandle.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
  }

  init(point) {
    this._point = point;
    const prevPointComponent = this._pointComponent;
    const prevEditPointComponent = this._editPointComponent;

    this._pointComponent = new TripPointTemplateView(point);
    this._editPointComponent = new EditPointTemplateView(point);

    this._pointComponent.setEditClickHandler(this._handleEditClick);
    this._pointComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._editPointComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._editPointComponent.setCloseEditPointHandler(this._handleCloseEditPoint);

    if (prevPointComponent === null || prevEditPointComponent === null) {
      render(this._tripListContainer, this._pointComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._tripListContainer.getElement().contains(prevPointComponent.getElement())) {
      replace(this._pointComponent, prevPointComponent);
    }

    if (this._tripListContainer.getElement().contains(prevEditPointComponent.getElement())) {
      replace(this._editPointComponent, prevEditPointComponent);
    }

    remove(prevPointComponent);
    remove(prevEditPointComponent);
  }

  destroy() {
    remove(this._pointComponent);
    remove(this._editPointComponent);
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

  _handleFavoriteClick() {
    this._changeData(
      Object.assign(
        {},
        this._point,
        {
          'is_favorite': !this._point.is_favorite,
        },
      ),
    );
  }
}
