import AbstractView from './abstract';

const createNewPointButtonTemplate = () => (
  '<button class="trip-main__event-add-btn btn btn--big btn--yellow" type="button">New event</button>'
);

export default class NewPointButtonTemplate extends AbstractView {
  constructor() {
    super();
    this._addNewPointHandler = this._addNewPointHandler.bind(this);
  }

  _addNewPointHandler(evt) {
    evt.preventDefault();
    this._callback.addNewPoint(evt.target);
  }

  setAddNewPointHandler(callback) {
    this._callback.addNewPoint = callback;
    this.getElement().addEventListener('click', this._addNewPointHandler);
  }

  getTemplate() {
    return createNewPointButtonTemplate();
  }
}
