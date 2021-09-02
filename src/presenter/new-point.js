import EditPointTemplateView from '../view/edit-point';
import {nanoid} from 'nanoid';
import {render, RenderPosition, remove} from '../utils/render';
import {UserAction, UpdateType, Key} from '../const';

export default class NewPoint {
  constructor(tripListContainer, changeData) {
    this._tripListContainer = tripListContainer;
    this._editPointComponent = null;
    this._destroyCallback = null;
    this._changeData = changeData;
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._deletePointHandler = this._deletePointHandler.bind(this);
    this._escKeyDownHandle = this._escKeyDownHandle.bind(this);
  }

  init(callback) {
    this._destroyCallback = callback;
    if (this._editPointComponent !== null) {
      return;
    }
    this._editPointComponent = new EditPointTemplateView();

    this._editPointComponent.setFormSubmitHandler(this._formSubmitHandler);
    this._editPointComponent.setDeletePointHandler(this._deletePointHandler);

    render(this._tripListContainer, this._editPointComponent, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this._escKeyDownHandle);

  }

  destroy() {
    if (this._editPointComponent === null) {
      return;
    }

    if (this._destroyCallback !== null) {
      this._destroyCallback();
    }

    remove(this._editPointComponent);
    this._editPointComponent = null;

    document.removeEventListener('keydown', this._escKeyDownHandle);
  }

  _formSubmitHandler(point) {
    this._changeData(
      UserAction.ADD_POINT,
      UpdateType.MAJOR,
      Object.assign({id: nanoid()}, point),
    );
    this.destroy();
  }

  _deletePointHandler() {
    this.destroy();
  }

  _escKeyDownHandle(evt) {
    if (Key.ESCAPE.includes(evt.key)) {
      evt.preventDefault();
      this.destroy();
    }
  }
}
