import { SERVER_API } from './config';

//CHANGE THAT. ALL THOSE REQUEST MUST BE FROM SERVER, NOT CLIENT
async function getTranslation({ langs, text }) {
  console.log('translated')
  try {
    const response = await fetch(`https://translate.yandex.net/api/v1.5/tr.json/translate?key=${process.env.REACT_APP_YTRANSL_KEY}&text=${text}&lang=${langs}`,
    { method: 'POST' }
    );
    const result = await response.json();
    return result;
  } catch (err) {
    console.error(err);
  }
}

//CHANGE THAT. ALL THOSE REQUEST MUST BE FROM SERVER, NOT CLIENT
async function checkDictionary({ langs, text }) {
  try {
    const response = await fetch(`https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=${process.env.REACT_APP_YDICT_KEY}&lang=${langs}&text=${text}`,
    { method: 'GET' }
    );
    const result = await response.json();
    return result.def;
  } catch (err) {
    console.error(err);
  }
}

export async function checkFrequency(word) {
  try {
    const response = await fetch(`${SERVER_API}/freq/${word}`,
    { method: 'GET' }
    );
    const result = await response.json();
    return result;
  } catch (err) {
    console.error(err);
  }
}

//find word (and translate) in dictionary api, if text is shorter 3 words. Otherwise, use translation api
export async function translate({ langs, text, inDictionary }) {
  if (text.split(' ').length < 3 && inDictionary) {
    const dictionary = await checkDictionary({ langs, text });

    if (dictionary.length > 0) {
      return dictionary;
    } else {
      return await getTranslation({ langs, text });
    }



  } else {
    return await getTranslation({ langs, text });
  }
}

//get list of available languages for translations from server
export async function getLanguages() {
  try {
    const response = await fetch(`${SERVER_API}/languages`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const result = await response.json();
    return result;
  } catch (err) {
    console.error(err);
  }
}

//get list of available languages for dictionary from server
export async function getDictionary() {
  try {
    const response = await fetch(`${SERVER_API}/dictionary`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const result = await response.json();
    return result;
  } catch (err) {
    console.error(err);
  }
}
