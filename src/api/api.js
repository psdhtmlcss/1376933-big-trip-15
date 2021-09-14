import PointsModel from '../model/points';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

export default class Api {
  constructor(address, authorization) {
    this._address = address;
    this._authorization = authorization;
  }

  getPoints() {
    return this._load({
      url: 'points',
    })
      .then(Api.toJSON)
      .then((points) => points.map(PointsModel.adaptToClient));
  }

  updatePoint(point) {
    return this._load({
      url: `points/${point.id}`,
      method: Method.PUT,
      body: JSON.stringify(PointsModel.adaptToServer(point)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    })
      .then(Api.toJSON)
      .then(PointsModel.adaptToClient);
  }

  addPoint(point) {
    return this._load({
      url: 'points',
      method: Method.POST,
      body: JSON.stringify(PointsModel.adaptToServer(point)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    })
      .then(Api.toJSON)
      .then(PointsModel.adaptToClient);
  }

  deletePoint(point) {
    return this._load({
      url: `points/${point.id}`,
      method: Method.DELETE,
    });
  }

  getDestinations() {
    return this._load({
      url: 'destinations',
    })
      .then(Api.toJSON);
  }

  getOffers() {
    return this._load({
      url: 'offers',
    })
      .then(Api.toJSON);
  }

  sync(data) {
    return this._load({
      url: 'points/sync',
      method: Method.POST,
      body: JSON.stringify(data),
      headers: new Headers({'content-type': 'application/json'}),
    })
      .then(Api.toJSON);
  }

  _load({url, method = Method.GET, body = null, headers = new Headers}) {
    headers.append('Authorization', this._authorization);

    return fetch(`${this._address}/${url}`, {method, body, headers}).then(Api.checkStatus).catch(Api.catchError);
  }

  static toJSON(response) {
    return response.json();
  }

  static checkStatus(response) {
    if(!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
    return response;
  }

  static catchError(error) {
    throw error;
  }
}
