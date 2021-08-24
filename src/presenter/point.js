import TripPointTemplateView from '../view/trip-point';
import EditPointTemplateView from '../view/edit-point';
import {render, RenderPosition, replace, remove} from '../utils/render';

const Keys = {
  ESCAPE_KEY: ['Escape', 'Esc'],
};

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class Point {
  constructor(tripListContainer, changeData, changeMode) {
    this._tripListContainer = tripListContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._pointComponent = null;
    this._editPointComponent = null;
    this._mode = Mode.DEFAULT;
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

    if (this._mode === Mode.DEFAULT) {
      replace(this._pointComponent, prevPointComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._editPointComponent, prevEditPointComponent);
    }

    remove(prevPointComponent);
    remove(prevEditPointComponent);
  }

  destroy() {
    remove(this._pointComponent);
    remove(this._editPointComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceFormToPoint();
    }
  }

  _replacePointToForm() {
    replace(this._editPointComponent, this._pointComponent);
    document.addEventListener('keydown', this._escKeyDownHandle);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _replaceFormToPoint() {
    replace(this._pointComponent, this._editPointComponent);
    document.removeEventListener('keydown', this._escKeyDownHandle);
    this._mode = Mode.DEFAULT;
  }

  _handleEditClick() {
    this._replacePointToForm();
  }

  _handleFormSubmit(point) {
    this._changeData(point);
    this._replaceFormToPoint();
  }

  _handleCloseEditPoint() {
    this._editPointComponent.reset(this._point);
    this._replaceFormToPoint();
  }

  _escKeyDownHandle(evt) {
    if (Keys.ESCAPE_KEY.includes(evt.key)) {
      evt.preventDefault();
      this._editPointComponent.reset(this._point);
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
