export const SHAKE_ANIMATION_TIMEOUT = 600;

export const SortType = {
  DAY: 'sort-day',
  EVENT: 'sort-event',
  TIME: 'sort-time',
  PRICE: 'sort-price',
  OFFER: 'sort-offer',
};

export const sorts = [
  {
    name: 'Day',
    type: SortType.DAY,
    isDisabled: false,
  },
  {
    name: 'Event',
    type: SortType.EVENT,
    isDisabled: true,
  },
  {
    name: 'Time',
    type: SortType.TIME,
    isDisabled: false,
  },
  {
    name: 'Price',
    type: SortType.PRICE,
    isDisabled: false,
  },
  {
    name: 'Offers',
    type: SortType.OFFER,
    isDisabled: true,
  },
];

export const FilterType = {
  EVERYTHING: 'filter-everything',
  FUTURE: 'filter-future',
  PAST: 'filter-past',
};

export const filters = [
  {
    name: 'Everything',
    type: FilterType.EVERYTHING,
  },
  {
    name: 'Future',
    type: FilterType.FUTURE,
  },
  {
    name: 'Past',
    type: FilterType.PAST,
  },
];

export const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

export const TagName = {
  LABEL: 'LABEL',
  ANCHOR: 'A',
};

export const SiteMenuName = {
  TABLE: 'Table',
  STATS: 'Stats',
};

export const Message = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no future events now',
  [FilterType.PAST]: 'There are no past events now',
};

export const Key = {
  ESCAPE: ['Escape', 'Esc'],
};

export const TimeMetric = {
  MIN_IN_HOURS: 60,
  MIN_IN_DAY: 1440,
  MS_IN_HOURS: 3600000,
  MS_IN_MINUTE: 60000,
  MS_IN_SECOND: 1000,
};

export const NumberSign = {
  TEN: '10',
};

export const Color = {
  WHITE: '#ffffff',
  BLACK: '#000000',
};

export const CurrencySigns = {
  EURO: '€',
};

export const Reduction = {
  MINUTE: 'M',
  HOURS: 'H',
  DAY: 'D',
};
