import TripMainInfoTemplateView from './view/trip-info-main';
import TripTotalCostTemplateView from './view/trip-total-cost';
import SiteMenuTemplateView from './view/site-menu';
import NewPointButtonTemplateView from './view/new-point-button';
import StatisticTemplateView from './view/statistic';
import FilterPresenter from './presenter/filter';
import TripPresenter from './presenter/trip';
import FilterModel from './model/filter';
import PointsModel from './model/points';
import {generatePoint} from './mock/points';
import {remove, render, RenderPosition} from './utils/render';
import {FilterType, UpdateType, SiteMenuName} from './const';

const POINT_COUNT = 22;
const siteHeader = document.querySelector('.trip-main');
const siteMain = document.querySelector('.page-main .page-body__container');
const tripInfoMain = siteHeader.querySelector('.trip-main__trip-info');
const siteMenu = siteHeader.querySelector('.trip-controls__navigation');
const tripFilters = siteHeader.querySelector('.trip-controls__filters');

const newPointButtonComponent = new NewPointButtonTemplateView();
const siteMenuComponent = new SiteMenuTemplateView();
const points = new Array(POINT_COUNT).fill().map(generatePoint);
const filterModel = new FilterModel();
const pointsModel = new PointsModel();

pointsModel.points = points;
const filterPresenter = new FilterPresenter(tripFilters, filterModel, pointsModel);
const tripPresenter = new TripPresenter(siteMain, pointsModel, filterModel);


render(tripInfoMain, new TripMainInfoTemplateView(), RenderPosition.BEFOREEND);
render(tripInfoMain, new TripTotalCostTemplateView(), RenderPosition.BEFOREEND);
render(siteMenu, siteMenuComponent, RenderPosition.BEFOREEND);
render(siteHeader, newPointButtonComponent, RenderPosition.BEFOREEND);

filterPresenter.init();
tripPresenter.init();

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
      statisticComponent = new StatisticTemplateView(pointsModel.points);
      render(siteMain, statisticComponent, RenderPosition.BEFOREEND);
      break;
  }
};

newPointButtonComponent.setAddNewPointHandler(handleNewPointClick);
siteMenuComponent.setToggleScreenClickHandler(handleSiteMenuClick);
