import {createElement} from '../utils';

const createMessagesTemplate = () => (
  '<p class="trip-events__msg">Click New Event to create your first point</p>'
);

export default class MessagesTemplate {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createMessagesTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
