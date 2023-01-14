const times = {
  'milliseconds': 1,
  'seconds': 1000,
  'minutes': 1000 * 60,
  'hours': 1000 * 60 * 60,
  'days': 1000 * 60 * 60 * 24
} 

const dateOrStringToTime = (date: Date | string) => {
  return typeof date === 'string'
    ? Date.parse(date)
    : date.valueOf();
}

// TODO: this is not reliable, does not take timezone or daylight savings into account!?
export const getTimeDifference = (date1: Date | string, date2: Date | string, time: keyof typeof times) => {
  const differenceInMs = dateOrStringToTime(date2) - dateOrStringToTime(date1);
  const dividerInMs = times[time];
  return Math.round(differenceInMs / dividerInMs);
}