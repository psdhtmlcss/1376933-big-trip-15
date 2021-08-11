import AbstractView from './abstract';

const createTripTotalCostTemplate = () => (
  `<p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">1230</span>
  </p>`
);

export default class TripTotalCostTemplate extends AbstractView {
  getTemplate() {
    return createTripTotalCostTemplate();
  }
}
