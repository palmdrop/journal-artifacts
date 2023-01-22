import { getTimeDifference } from "../tools/date";
// import { data } from "./test-data";

// const filePath = 'https://artifacts-test.hypervivid.pages.dev/api/artifacts';
const filePath = 'https://palmdrop.site/api/artifacts';

//                      #  (yyyy   -MM     -dd     Thh     :mm               )(entry )  (footnote)
const entryParseRegex = /(([\d]{4})-([\d]{2})-([\d]{2})T([\d]{2}):([\d]{2}))([^\[]*)\[([^\]]*)\]/g;

export type Day = {
  count: number,
  entryIndices: number[],
  datetime: string
};


export type EntryData = {
  metadata: {
    datetime: string,
    formattedDate: string,
    year: string,
    month: string,
    day: string,
    hour: string,
    minute: string,
  },
  content: string,
  note: string,
  dayIndex: number
}

export const getData = async () => {
  try {
    const response = await fetch(filePath, {
      method: 'GET',
      mode: 'cors',
    });

    return await response.json();
  } catch (error) {
    console.log(error);
  }
}

const processData = (data: string) => {
  // NOTE: matchall is slow, cache result and only redo it if document is stale!
  // TODO: implement pagination! do not process all data unless needed. Cache pages
  const entries = [...data.matchAll(entryParseRegex)]
    .map(match => processMatch(match));

  // Is this faster?
  // const entries = data
  //  .split("#")
  //  .map(line => {
  //    const match = line.match(entryParseRegex);
  //    if(match) return processMatch(match);
  //    return undefined;
  //  })
  //  .filter(Boolean);

  const firstDate = entries.at(0).metadata.datetime;
  const lastDate = entries.at(-1).metadata.datetime;

  const numberOfDays = 1 + getTimeDifference(
    firstDate, lastDate, 'days'
  );

  const timeline: Day[] = []
  for(let i = 0; i < numberOfDays; i++) {
    timeline.push({
      count: 0,
      entryIndices: [],
      datetime: ''
    });
  }

  entries.forEach((entry, i) => {
    const dayIndex = getTimeDifference(
      entry.metadata.datetime, lastDate, 'days'
    );

    entry.dayIndex = dayIndex;
    const day = timeline[dayIndex];
    day.count++;
    day.entryIndices.push(i);

    if(day.datetime === '') {
      day.datetime = entry.metadata.datetime.split('T')[0];
    }
  });

  return {
    entries,
    timeline,
    numberOfDays
  }
}

const processMatch = (match: RegExpMatchArray): EntryData => {
  const [
    ,
    datetime,
    year,
    month,
    day,
    hour,
    minute,
    content,
    note
  ] = match;

  const formattedDate = datetime.replace('T', ' ');

  return {
    metadata: {
      datetime,
      formattedDate,
      year,
      month,
      day,
      hour,
      minute
    },
    content,
    note,
    dayIndex: -1
  };
}