import AbstractView from './abstract';

const createTripListTemplate = () => (
  '<ul class="trip-events__list"></ul>'
);

export default class TripListTemplate extends AbstractView {
  getTemplate() {
    return createTripListTemplate();
  }
}
