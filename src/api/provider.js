import PointsModel from '../model/points';

const getSyncedPoints = (items) => items.filter(({success}) => success).map(({payload}) => payload.point);

const createPointsStoreStructure = (items) => items.reduce((acc, current) => Object.assign({}, acc, {[current.id]: current}), {});

export default class Provider {
  constructor(api, storePoints, storeDestinations, storeOffers) {
    this._api = api;
    this._storePoints = storePoints;
    this._storeDestinations = storeDestinations;
    this._storeOffers = storeOffers;
    this._needSync = false;
  }

  set(isNeedSync) {
    this._needSync = isNeedSync;
  }

  get() {
    return this._needSync;
  }

  getPoints() {
    if (this._isOnline()) {
      return this._api.getPoints()
        .then((points) => {
          const items = createPointsStoreStructure(points.map(PointsModel.adaptToServer));
          this._storePoints.setItems(items);
          return points;
        });
    }

    const storePoints = Object.values(this._storePoints.getItems());

    return Promise.resolve(storePoints.map(PointsModel.adaptToClient));
  }

  updatePoint(point) {
    if (this._isOnline()) {
      return this._api.updatePoint(point)
        .then((updatedPoint) => {
          this._storePoints.setItem(updatedPoint.id, PointsModel.adaptToServer(updatedPoint));
          return updatedPoint;
        });
    }

    this._storePoints.setItem(point.id, PointsModel.adaptToServer(Object.assign({}, point)));
    this.needSync = true;
    return Promise.resolve(point);
  }

  addPoint(point) {
    if (this._isOnline()) {
      return this._api.addPoint(point)
        .then((newPoint) => {
          this._storePoints.setItem(newPoint.id, PointsModel.adaptToServer(newPoint));
          return newPoint;
        });
    }

    return Promise.reject(new Error('Add point failed'));
  }

  deletePoint(point) {
    if (this._isOnline()) {
      return this._api.deletePoint(point)
        .then(() => this._storePoints.removeItem(point.id));
    }

    return Promise.reject(new Error('Delete point failed'));
  }

  getDestinations() {
    if (this._isOnline()) {
      return this._api.getDestinations()
        .then((destinations) => {
          this._storeDestinations.setItems(destinations);
          return destinations;
        });
    }

    return Promise.resolve(this._storeDestinations.getItems());

  }

  getOffers() {
    if (this._isOnline()) {
      return this._api.getOffers()
        .then((offers) => {
          this._storeOffers.setItems(offers);
          return offers;
        });
    }
    return Promise.resolve(this._storeOffers.getItems());
  }

  sync() {
    if (this._isOnline()) {
      const storePoints = Object.values(this._storePoints.getItems());
      return this._api.sync(storePoints)
        .then((response) => {
          const createdPoints = getSyncedPoints(response.created);
          const updatedPoints = getSyncedPoints(response.updated);
          const items = createPointsStoreStructure([...createdPoints, ...updatedPoints]);

          this._storePoints.setItems(items);
          this.needSync = false;
        });
    }

    return Promise.reject(new Error('Sync data failed'));
  }

  _isOnline() {
    return window.navigator.onLine;
  }
}
