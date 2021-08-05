import {getRandomInteger} from '../utils';

const cities = ['Amsterdam', 'Chamonix', 'Geneva'];
const fishText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.Cras aliquet varius magna, non porta ligula feugiat eget.Fusce tristique felis at fermentum pharetra.Aliquam id orci ut lectus varius viverra.Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.Sed sed nisi sed augue convallis suscipit in sed felis.Aliquam erat volutpat.Nunc fermentum tortor ac porta dapibus.In rutrum ac purus sit amet tempus.';
const destinationsMock = [];


const generateDescription = () => {
  const MAX_LENGTH = 5;
  const isDescription = Boolean(getRandomInteger(0, 1));
  let description = [];
  if (isDescription) {
    const text = fishText.split('.');
    for (let i = 0; i < MAX_LENGTH; i++) {
      description.push(text[getRandomInteger(0, text.length - 2)]);
    }
    return description.join('.');
  } else {
    return description = null;
  }

};

const generatePictures = () => {
  const MIN_PICTURES_COUNT = 1;
  const MAX_PICTURES_COUNT = 5;
  const MAX_PICTURE_NUMBER = 7;
  const isPictures = Boolean(getRandomInteger(0, 1));
  let pictures = [];
  if (isPictures) {
    for (let i = 0; i < getRandomInteger(MIN_PICTURES_COUNT, MAX_PICTURES_COUNT); i++) {
      pictures.push({
        'src': `http://picsum.photos/300/200?r=${getRandomInteger(0, MAX_PICTURE_NUMBER)}`,
        'description': 'Chamonix parliament building',
      });
    }
    return pictures;
  } else {
    return pictures = null;
  }
};

const createDestinationMock = () => {
  cities.forEach((city) => {
    destinationsMock.push({
      'description': generateDescription(),
      'name': city,
      'pictures': generatePictures(),
    });
  });

  return destinationsMock;

};

export const destinations = createDestinationMock();
