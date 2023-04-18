export const countCity = (cities: Array<string>) => {
  const countsByCity = {};

  cities.forEach((city) => {
    if (countsByCity[city]) {
      countsByCity[city]++;
    } else {
      countsByCity[city] = 1;
    }
  });

  return countsByCity;
};
