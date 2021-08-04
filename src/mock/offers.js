import {getRandomInteger} from '../utils';
const types = ["taxi", "bus", "train", "ship", "drive", "flight", "check-in", "sightseeing", "restaurant"];
const availableOffers = [
  {
    "title": "Add luggage",
    "price": 50
  },
  {
    "title": "Switch to comfort",
    "price": 80
  },
  {
    "title": "Add meal",
    "price": 15
  },
  {
    "title": "Choose seats",
    "price": 5
  },
  {
    "title": "Travel by train",
    "price": 40
  }
];

let offersMock = {};

const createOffersMock = () => {
  types.forEach((item) => {
    offersMock[item] = availableOffers.slice(0, getRandomInteger(0, availableOffers.length));
  })
  return offersMock;
};

export const offers = createOffersMock();
