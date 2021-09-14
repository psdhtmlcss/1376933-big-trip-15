import AbstractView from './abstract';

const createNewPointButtonTemplate = () => (
  '<button class="trip-main__event-add-btn btn btn--big btn--yellow" type="button" disabled>New event</button>'
);

export default class NewPointButtonTemplate extends AbstractView {
  constructor() {
    super();
    this._addNewPointHandler = this._addNewPointHandler.bind(this);
  }

  setAddNewPointHandler(callback) {
    this._callback.addNewPoint = callback;
    this.getElement().addEventListener('click', this._addNewPointHandler);
  }

  getTemplate() {
    return createNewPointButtonTemplate();
  }

  _addNewPointHandler(evt) {
    evt.preventDefault();
    this._callback.addNewPoint(evt.target);
  }
}
