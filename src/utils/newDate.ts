export const newDate = () => {
  const newDate = new Date()
    .toLocaleString('en-US', {
      hour12: false,
      timeZone: 'America/Sao_Paulo',
    })
    .replace(/[/]/g, '-');

  const [date, time] = newDate.split(', ');
  const [month, day, year] = date.split('-');

  return `${year}-${month.padStart(2, '0')}-${day}T${time}`;
};
