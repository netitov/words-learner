import { SERVER_API } from './config';

export async function checkFrequency(word) {
  try {
    const response = await fetch(`${SERVER_API}/word-data/${word}`,
      { method: 'GET' }
    );
    const result = await response.json();
    return result;
  } catch (err) {
    console.error(err);
  }
}

export async function getRandomWords(obj) {
  try {

    const queryParams = new URLSearchParams(obj);

    const response = await fetch(`${SERVER_API}/random-words?${queryParams}`,
      { method: 'GET' }
    );

    const result = await response.json();
    console.log('REQ')
    return result;
  } catch (err) {
    console.error(err);
  }
}

//find word (and translate) in dictionary api, if text is shorter 3 words. Otherwise, use translation api
export async function translate({ langs, text, inDictionary }) {
  try {
    const response = await fetch(`${SERVER_API}/translate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ langs, text, inDictionary })
    });
    const result = await response.json();
    return result;
  } catch (err) {
    console.error(err);
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
