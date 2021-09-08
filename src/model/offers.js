export default class Offers {
  constructor() {
    this._offers = [];
  }

  set(offers) {
    this._offers = offers.slice();
  }

  get() {
    return this._offers;
  }
}
