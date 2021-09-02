import TripMainInfoTemplateView from './view/trip-info-main';
import TripTotalCostTemplateView from './view/trip-total-cost';
import SiteMenuView from './view/site-menu';
import NewPointButtonTemplateView from './view/new-point-button';
import FilterPresenter from './presenter/filter';
import TripPresenter from './presenter/trip';
import FilterModel from './model/filter';
import PointsModel from './model/points';
import {generatePoint} from './mock/points';
import {render, RenderPosition} from './utils/render';
import {FilterType, UpdateType} from './const';


const POINT_COUNT = 22;
const siteHeader = document.querySelector('.trip-main');
const siteMain = document.querySelector('.page-main');
const tripInfoMain = siteHeader.querySelector('.trip-main__trip-info');
const siteMenu = siteHeader.querySelector('.trip-controls__navigation');
const tripFilters = siteHeader.querySelector('.trip-controls__filters');
const tripEvents = siteMain.querySelector('.trip-events');

const NewPointButtonComponent = new NewPointButtonTemplateView();
const points = new Array(POINT_COUNT).fill().map(generatePoint);
const filterModel = new FilterModel();
const pointsModel = new PointsModel();

pointsModel.points = points;

const filterPresenter = new FilterPresenter(tripFilters, filterModel, pointsModel);
const tripPresenter = new TripPresenter(tripEvents, pointsModel, filterModel);


render(tripInfoMain, new TripMainInfoTemplateView(), RenderPosition.BEFOREEND);
render(tripInfoMain, new TripTotalCostTemplateView(), RenderPosition.BEFOREEND);
render(siteMenu, new SiteMenuView(), RenderPosition.BEFOREEND);
render(siteHeader, NewPointButtonComponent, RenderPosition.BEFOREEND);

filterPresenter.init();
tripPresenter.init();

const handleTaskNewFormClose = () => {
  siteHeader.querySelector('.trip-main__event-add-btn').disabled = false;
};

const handleNewPointClick = (button) => {
  button.disabled = true;
  tripPresenter.destroy();
  filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
  tripPresenter.init();
  tripPresenter.createNewPoint(handleTaskNewFormClose);
};

NewPointButtonComponent.setAddNewPointHandler(handleNewPointClick);
