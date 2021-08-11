import AbstractView from './abstract';

const createMessagesTemplate = () => (
  '<p class="trip-events__msg">Click New Event to create your first point</p>'
);

export default class MessagesTemplate extends AbstractView {
  getTemplate() {
    return createMessagesTemplate();
  }
}
