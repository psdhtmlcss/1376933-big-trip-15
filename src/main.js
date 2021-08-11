import TripMainInfoTemplateView from './view/trip-info-main';
import TripTotalCostTemplateView from './view/trip-total-cost';
import SiteMenuView from './view/site-menu';
import FiltersTemplateView from './view/trip-filters';
import SortTemplateView from './view/trip-sort';
import TripPointTemplateView from './view/trip-point';
import EditPointTemplateView from './view/edit-point';
import MessagesTemplateView from './view/messages';
import {generatePoint} from './mock/points';
import {render, RenderPosition, replace} from './utils/render';

const Keys = {
  ESCAPE_KEY: ['Escape', 'Esc'],
};
const POINT_COUNT = 22;
const siteHeader = document.querySelector('.page-header');
const siteMain = document.querySelector('.page-main');
const tripInfoMain = siteHeader.querySelector('.trip-main__trip-info');
const siteMenu = siteHeader.querySelector('.trip-controls__navigation');
const tripFilters = siteHeader.querySelector('.trip-controls__filters');
const tripEvents = siteMain.querySelector('.trip-events');
const tripListContainer = tripEvents.querySelector('.trip-events__list');
const points = new Array(POINT_COUNT).fill().map(generatePoint);

const renderPoint = (container, point) => {
  const pointComponent = new TripPointTemplateView(point);
  const editPointComponent = new EditPointTemplateView(point);

  const replacePointToForm = () => {
    replace(editPointComponent, pointComponent);
  };

  const replaceFormToPoint = () => {
    replace(pointComponent, editPointComponent);
  };

  const onEscKeyDown = (evt) => {
    if (Keys.ESCAPE_KEY.includes(evt.key)) {
      evt.preventDefault();
      replaceFormToPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  pointComponent.setEditClickHandler(() => {
    replacePointToForm();
    document.addEventListener('keydown', onEscKeyDown);
  });

  editPointComponent.setFormSubmitHandler(() => {
    replaceFormToPoint();
    document.removeEventListener('keydown', onEscKeyDown);
  });

  editPointComponent.setCloseEditPointHandler(() => {
    replaceFormToPoint();
    document.removeEventListener('keydown', onEscKeyDown);
  });
  render(container, pointComponent, RenderPosition.BEFOREEND);
};

render(tripInfoMain, new TripMainInfoTemplateView(), RenderPosition.BEFOREEND);
render(tripInfoMain, new TripTotalCostTemplateView(), RenderPosition.BEFOREEND);
render(siteMenu, new SiteMenuView(), RenderPosition.BEFOREEND);
render(tripFilters, new FiltersTemplateView(), RenderPosition.BEFOREEND);
render(tripEvents, new SortTemplateView(), RenderPosition.AFTERBEGIN);

if (POINT_COUNT === 0) {
  render(tripEvents, new MessagesTemplateView(), RenderPosition.BEFOREEND);
} else {
  for (let i = 0; i < POINT_COUNT; i++) {
    renderPoint(tripListContainer, points[i]);
  }
}
