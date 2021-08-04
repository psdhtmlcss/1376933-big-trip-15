import {createTripInfoMainTemplate} from './view/trip-info-main';
import {createTripTotalCostTemplate} from './view/trip-total-cost';
import {createSiteMenuTemplate} from './view/site-menu';
import {createTripFiltersTemplate} from './view/trip-filters';
import {createTripSortTemplate} from './view/trip-sort';
import {createTripPointTemplate} from './view/trip-point';
import {createEditPointTemplate} from './view/edit-point';
import {generatePoint} from './mock/points';

const POINT_COUNT = 20;
const siteHeader = document.querySelector('.page-header');
const siteMain = document.querySelector('.page-main');
const tripInfoMain = siteHeader.querySelector('.trip-main__trip-info');
const siteMenu = siteHeader.querySelector('.trip-controls__navigation');
const tripFilters = siteHeader.querySelector('.trip-controls__filters');
const tripEvents = siteMain.querySelector('.trip-events');
const tripListContainer = tripEvents.querySelector('.trip-events__list');
const points = new Array(POINT_COUNT).fill().map(generatePoint);

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

render(tripInfoMain, createTripInfoMainTemplate(), 'beforeend');
render(tripInfoMain, createTripTotalCostTemplate(), 'beforeend');
render(siteMenu, createSiteMenuTemplate(), 'beforeend');
render(tripFilters, createTripFiltersTemplate(), 'beforeend');
render(tripEvents, createTripSortTemplate(), 'afterbegin');

for (let i = 0; i < POINT_COUNT; i++) {
  render(tripListContainer, createTripPointTemplate(points[i]), 'beforeend');
}

render(tripListContainer, createEditPointTemplate(points[0]), 'afterbegin');
