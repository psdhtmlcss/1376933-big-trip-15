const getPointsByTypes = (points, type) => points.filter((point) => point.type === type);

export const calcCostPointsByType = (type, points) => {
  const pointsByTypes = getPointsByTypes(points, type);
  return pointsByTypes.length ? {[type]: pointsByTypes.reduce((previosValue, current) => previosValue + Number(current.basePrice), 0)} : {[type]: 0};
};

export const calcTypesCount = (type, points) => ({[type]: (points.filter((point) => point.type === type)).length});

export const calcTimeSpend = (type, points) => {
  const pointsByTypes = getPointsByTypes(points, type);
  return {[type]: pointsByTypes.reduce((previosValue, current) => previosValue + (Date.parse(current.dateTo) - Date.parse(current.dateFrom)), 0)};
};

export const sortData = (types) => {
  types.sort((a, b) => Object.values(b)[0] - Object.values(a)[0]);
};
