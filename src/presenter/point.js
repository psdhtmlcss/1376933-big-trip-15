import TripPointView from '../view/trip-point';
import EditPointView from '../view/edit-point';
import {render, RenderPosition, replace, remove} from '../utils/render';
import {UserAction, UpdateType, Key} from '../const';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export const State = {
  SAVING: 'SAVING',
  DELETING: 'DELETING',
  ABORTING: 'ABORTING',
};

export default class Point {
  constructor(tripListContainer, changeData, changeMode, destinations, offers) {
    this._tripListContainer = tripListContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._destinations = destinations;
    this._offers = offers;
    this._pointComponent = null;
    this._editPointComponent = null;
    this._mode = Mode.DEFAULT;
    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeletePoint = this._handleDeletePoint.bind(this);
    this._handleCloseEditPoint = this._handleCloseEditPoint.bind(this);
    this._escKeyDownHandle = this._escKeyDownHandle.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
  }

  init(point) {
    this._point = point;
    const prevPointComponent = this._pointComponent;
    const prevEditPointComponent = this._editPointComponent;

    this._pointComponent = new TripPointView(point);
    this._editPointComponent = new EditPointView(point, false, this._destinations, this._offers);

    this._pointComponent.setEditClickHandler(this._handleEditClick);
    this._pointComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._editPointComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._editPointComponent.setDeletePointHandler(this._handleDeletePoint);
    this._editPointComponent.setCloseEditPointHandler(this._handleCloseEditPoint);

    if (prevPointComponent === null || prevEditPointComponent === null) {
      render(this._tripListContainer, this._pointComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._pointComponent, prevPointComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._pointComponent, prevEditPointComponent);
      this._mode === Mode.DEFAULT;
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

  setViewState(state) {
    if (this._mode === Mode.DEFAULT) {
      return;
    }

    const resetFormState = () => {
      this._editPointComponent.updateData({
        isDeleting: false,
        isSaving: false,
        isDisabled: false,
      });
    };

    switch(state) {
      case State.SAVING:
        this._editPointComponent.updateData({
          isSaving: true,
          isDisabled: true,
        });
        break;
      case State.DELETING:
        this._editPointComponent.updateData({
          isDeleting: true,
          isDisabled: true,
        });
        break;
      case State.ABORTING:
        this._pointComponent.shake(resetFormState);
        this._editPointComponent.shake(resetFormState);
        break;
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
    if (point.destination.name !== this._point.destination.name
      || point.basePrice !== this._point.basePrice
      || Date.parse(point.dateFrom) !== Date.parse(this._point.dateFrom)
      || Date.parse(point.dateTo) !== Date.parse(this._point.dateTo)
      || point.offers.length !== this._point.offers.length) {
      this._changeData(
        UserAction.UPDATE_POINT,
        UpdateType.MINOR,
        point,
      );
    } else {
      this._replaceFormToPoint();
    }
  }

  _handleDeletePoint() {
    this._changeData(
      UserAction.DELETE_POINT,
      UpdateType.MAJOR,
      this._point,
    );
  }

  _handleCloseEditPoint() {
    this._editPointComponent.reset(this._point);
    this._replaceFormToPoint();
  }

  _escKeyDownHandle(evt) {
    if (Key.ESCAPE.includes(evt.key)) {
      evt.preventDefault();
      this._editPointComponent.reset(this._point);
      this._replaceFormToPoint();
      document.removeEventListener('keydown', this._escKeyDownHandle);
    }
  }

  _handleFavoriteClick() {
    this._changeData(
      UserAction.UPDATE_POINT,
      UpdateType.PATCH,
      Object.assign(
        {},
        this._point,
        {
          'isFavorite': !this._point.isFavorite,
        },
      ),
    );
  }
}
