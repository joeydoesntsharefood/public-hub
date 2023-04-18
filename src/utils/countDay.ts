export const countDay = (dates: Array<string>) => {
  const countsByDay = {};

  dates.forEach((date) => {
    if (countsByDay[date]) {
      countsByDay[date]++;
    } else {
      countsByDay[date] = 1;
    }
  });

  return countsByDay;
};
