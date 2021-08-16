import TripMainInfoTemplateView from './view/trip-info-main';
import TripTotalCostTemplateView from './view/trip-total-cost';
import SiteMenuView from './view/site-menu';
import FiltersTemplateView from './view/trip-filters';
import TripPresenter from './presenter/trip';
import {generatePoint} from './mock/points';
import {render, RenderPosition} from './utils/render';


const POINT_COUNT = 22;
const siteHeader = document.querySelector('.page-header');
const siteMain = document.querySelector('.page-main');
const tripInfoMain = siteHeader.querySelector('.trip-main__trip-info');
const siteMenu = siteHeader.querySelector('.trip-controls__navigation');
const tripFilters = siteHeader.querySelector('.trip-controls__filters');
const tripEvents = siteMain.querySelector('.trip-events');
const points = new Array(POINT_COUNT).fill().map(generatePoint);
const tripPresenter = new TripPresenter(tripEvents);

render(tripInfoMain, new TripMainInfoTemplateView(), RenderPosition.BEFOREEND);
render(tripInfoMain, new TripTotalCostTemplateView(), RenderPosition.BEFOREEND);
render(siteMenu, new SiteMenuView(), RenderPosition.BEFOREEND);
render(tripFilters, new FiltersTemplateView(), RenderPosition.BEFOREEND);

tripPresenter.init(points);
