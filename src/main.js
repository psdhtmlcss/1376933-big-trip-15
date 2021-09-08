import TripMainInfoTemplateView from './view/trip-info-main';
import TripTotalCostTemplateView from './view/trip-total-cost';
import SiteMenuTemplateView from './view/site-menu';
import NewPointButtonTemplateView from './view/new-point-button';
import StatisticTemplateView from './view/statistic';
import FilterPresenter from './presenter/filter';
import TripPresenter from './presenter/trip';
import FilterModel from './model/filter';
import DestinationsModel from './model/destinations';
import OffersModel from './model/offers';
import PointsModel from './model/points';
import Api from './api';
import {remove, render, RenderPosition} from './utils/render';
import {FilterType, UpdateType, SiteMenuName} from './const';

const ADDRESS = 'https://15.ecmascript.pages.academy/big-trip';
const AUTHORIZATION = 'Basic %basde117c%g%';
const siteHeader = document.querySelector('.trip-main');
const siteMain = document.querySelector('.page-main .page-body__container');
const tripInfoMain = siteHeader.querySelector('.trip-main__trip-info');
const siteMenu = siteHeader.querySelector('.trip-controls__navigation');
const tripFilters = siteHeader.querySelector('.trip-controls__filters');

const newPointButtonComponent = new NewPointButtonTemplateView();
const siteMenuComponent = new SiteMenuTemplateView();

const api = new Api(ADDRESS, AUTHORIZATION);

const filterModel = new FilterModel();
const destinationsModel = new DestinationsModel();
const offersModel = new OffersModel();
const pointsModel = new PointsModel();

const filterPresenter = new FilterPresenter(tripFilters, filterModel, pointsModel);
const tripPresenter = new TripPresenter(siteMain, pointsModel, filterModel, destinationsModel, offersModel, api);

const handlePointNewFormClose = () => {
  siteHeader.querySelector('.trip-main__event-add-btn').disabled = false;
};

const handleNewPointClick = (button) => {
  button.disabled = true;
  tripPresenter.destroy();
  filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
  tripPresenter.init();
  tripPresenter.createNewPoint(handlePointNewFormClose);
};

let statisticComponent = null;

const handleSiteMenuClick = (item) => {
  switch(item) {
    case SiteMenuName.TABLE:
      remove(statisticComponent);
      siteHeader.querySelector('.trip-main__event-add-btn').disabled = false;
      tripPresenter.init();
      break;
    case SiteMenuName.STATS:
      tripPresenter.destroy();
      siteHeader.querySelector('.trip-main__event-add-btn').disabled = true;
      statisticComponent = new StatisticTemplateView(pointsModel.getPoints(), offersModel.offers);
      render(siteMain, statisticComponent, RenderPosition.BEFOREEND);
      break;
  }
};

const renderHeaderElements = () => {
  render(tripInfoMain, new TripMainInfoTemplateView(), RenderPosition.BEFOREEND);
  render(tripInfoMain, new TripTotalCostTemplateView(), RenderPosition.BEFOREEND);
  newPointButtonComponent.setAddNewPointHandler(handleNewPointClick);
  siteHeader.querySelector('.trip-main__event-add-btn').disabled = false;
  siteMenuComponent.setToggleScreenClickHandler(handleSiteMenuClick);
};

render(siteMenu, siteMenuComponent, RenderPosition.BEFOREEND);
render(siteHeader, newPointButtonComponent, RenderPosition.BEFOREEND);

filterPresenter.init();
tripPresenter.init();

Promise.all([
  api.getDestinations().then((destinations) => destinationsModel.destinations = destinations),
  api.getOffers().then((offers) => offersModel.offers = offers),
]).then(() => {
  api.getPoints()
    .then((points) => {
      pointsModel.setPoints(UpdateType.INIT, points);
      renderHeaderElements();
    }).catch(() => {
      pointsModel.setPoints(UpdateType.INIT, []);
      renderHeaderElements();
    });
}).catch(() => {
  siteMain.querySelector('.trip-events__msg').textContent = 'Failed to load data from the server. Try to visit the site later';
  siteMenu.remove();
  tripFilters.remove();
});


