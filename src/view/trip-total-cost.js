import AbstractView from './abstract';

const renderTotalCost = (points) => {
  let totalCost = 0;
  points.forEach((point) => {
    if (point.offers.length) {
      totalCost += point.offers.reduce((previosValue, current) => previosValue + current.price, point.basePrice);
    } else {
      totalCost += point.basePrice;
    }
  });
  return totalCost;

};

const createTripTotalCostTemplate = (points) => (
  `<p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">${renderTotalCost(points)}</span>
  </p>`
);

export default class TripTotalCost extends AbstractView {
  constructor(points) {
    super();
    this._points = points;
  }

  getTemplate() {
    return createTripTotalCostTemplate(this._points);
  }
}
