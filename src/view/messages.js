import AbstractView from './abstract';
import {Message} from '../const';

const createMessagesTemplate = (filterType) => (
  `<p class="trip-events__msg">${Message[filterType]}</p>`
);

export default class Messages extends AbstractView {
  constructor(filterType) {
    super();
    this._filterType = filterType;
  }

  getTemplate() {
    return createMessagesTemplate(this._filterType);
  }
}
