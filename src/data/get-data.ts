import { getTimeDifference } from "../tools/date";
import { data } from "./test-data";

// const accessToken = import.meta.env.VITE_DROPBOX_ACCESS_TOKEN;
const filePath = import.meta.env.VITE_DROPBOX_FILE_PATH;

//                      #  (yyyy   -MM     -dd     Thh     :mm               )(entry )  (footnote)
const entryParseRegex = /(([\d]{4})-([\d]{2})-([\d]{2})T([\d]{2}):([\d]{2}))([^\[]*)\[([^\]]*)\]/g;

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

export const getDataLocalTest = async () => {
  try {
    /*
    const response = await fetch('https://content.dropboxapi.com/2/files/download', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Dropbox-API-Arg': JSON.stringify({
          path: filePath
        })
      }
    });
    */

    // TODO: fetch data using actual dropbox API
    /*
    const response = await fetch(filePath, {
      method: 'GET',
      mode: 'cors',
    });

    const data = await response.text();
    */

    return processData(data);
  } catch (error) {
    console.log(error);
  }
}

const processData = (data: string) => {
  // NOTE: matchall is slow, cache result and only redo it if document is stale!
  // TODO: implement pagination! do not process all data unless needed. Cache pages
  const entries = [...data.matchAll(entryParseRegex)]
    .map(match => processMatch(match));

  /*
  // Is this faster?
  const entries = data
    .split("#")
    .map(line => {
      const match = line.match(entryParseRegex);
      if(match) return processMatch(match);
      return undefined;
    })
    .filter(Boolean);
  */

  const firstDate = entries.at(0).metadata.datetime;
  const lastDate = entries.at(-1).metadata.datetime;

  const numberOfDays = getTimeDifference(
    firstDate, lastDate, 'days'
  );

  const timeline = Array<number>(numberOfDays + 1).fill(0);

  entries.forEach(entry => {
    const dayIndex = getTimeDifference(
      entry.metadata.datetime, lastDate, 'days'
    );

    entry.dayIndex = dayIndex;
    timeline[dayIndex]++;
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