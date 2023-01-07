const accessToken = import.meta.env.VITE_DROPBOX_ACCESS_TOKEN;
const filePath = import.meta.env.VITE_DROPBOX_FILE_PATH;

//                      #  (yyyy   -MM     -dd     Thh     :mm     )(entry )  (footnote)
const entryParseRegex = /# ([\d]{4}-[\d]{2}-[\d]{2}T[\d]{2}:[\d]{2})([^\[]*)\[([^\]]*)\]/g;

export type EntryData = {
  datetime: string,
  content: string,
  note: string
}

export const getDataLocalTest = async () => {
  try {
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

    const data = await response.text();

    return processData(data);
  } catch (error) {
    console.log(error);
  }
}

const processData = (data: string) => {
  return [...data.matchAll(entryParseRegex)]
    .map(match => processMatch(match));
}

const processMatch = (match: RegExpMatchArray) => {
  const [
    ,
    datetime,
    content,
    note
  ] = match;

  return {
    datetime,
    content,
    note
  };
}