export default class Destinations {
  constructor() {
    this._destinations = [];
  }

  set(destinations) {
    this._destinations = destinations.slice();
  }

  get() {
    return this._destinations;
  }
}
