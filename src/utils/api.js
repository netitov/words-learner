import { SERVER_API } from './config';

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

async function checkDictionary({ langs, text }) {
  console.log('dictionared')
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
