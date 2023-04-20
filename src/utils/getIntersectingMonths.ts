export const getIntersectingMonths = ({
  startAt,
  endAt,
}: {
  startAt: string;
  endAt: string;
}): string[] => {
  const startDate = new Date(startAt);
  const endDate = new Date(endAt);

  startDate.setMonth(startDate.getMonth() + 1);

  const months: string[] = [];
  const date = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
  while (date <= endDate) {
    if (date >= startDate)
      months.push(date.toLocaleString('default', { month: '2-digit' }));
    else if (date <= endDate)
      months.push(date.toLocaleString('default', { month: '2-digit' }));
    date.setMonth(date.getMonth() + 1);
  }

  const firstMonth = new Date(startAt).toLocaleString('default', {
    month: '2-digit',
  });
  if (!months.includes(firstMonth)) {
    months.unshift(firstMonth);
  }

  return months;
};
