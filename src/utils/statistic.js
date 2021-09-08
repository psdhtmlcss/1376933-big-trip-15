export const calcCostPointsByType = (type, points) => {
  const pointsByTypes = points.filter((point) => point.type === type);
  return pointsByTypes.length ? {[type]: pointsByTypes.reduce((previosValue, current) => previosValue + Number(current.basePrice), 0)} : {[type]: 0};
};

export const calcTypesCount = (type, points) => ({[type]: (points.filter((point) => point.type === type)).length});

export const calcTimeSpend = (type, points) => {
  const pointsByTypes = points.filter((point) => point.type === type);
  return {[type]: pointsByTypes.reduce((previosValue, current) => previosValue + (Date.parse(current.dateTo) - Date.parse(current.dateFrom)), 0)};
};

export const sortData = (types) => {
  types.sort((a, b) => {
    a = Object.values(a)[0];
    b = Object.values(b)[0];
    if (a > b) {
      return -1;
    } else if (a < b) {
      return 1;
    } else {
      return 0;
    }
  });
};