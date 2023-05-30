
export async function translate({ translateTo, text }) {
  try {
    const response = await fetch(`https://translate.yandex.net/api/v1.5/tr.json/translate?key=${process.env.REACT_APP_YTRANSL_KEY}&text=${text}&lang=en-ru`,
    { method: 'POST' }
    );
    const result = await response.json();
    return result;

  } catch (err) {
    console.error(err);
  }

}
