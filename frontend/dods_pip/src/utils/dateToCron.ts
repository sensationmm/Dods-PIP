import { getDate, getHours, getMinutes, getMonth, getSeconds, getYear } from 'date-fns';

const dateToCron = (date: Date): string => {
  const seconds = getSeconds(date);
  const minutes = getMinutes(date);
  const hours = getHours(date);
  const day = getDate(date);
  const month = getMonth(date) + 1;
  const year = getYear(date);
  return `${seconds} ${minutes} ${hours} ${day} ${month} ? ${year}`;
};

export default dateToCron;
