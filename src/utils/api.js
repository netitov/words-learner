import { SERVER_API } from './config';

export async function translate({ langs, text }) {
  console.log('translated')
  console.log({ langs, text })
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
