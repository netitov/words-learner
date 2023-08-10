import { SERVER_API } from './config';

async function fetchAPI(path, method, headers, body) {
  try {
    const options = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...headers
      },
      body: method === 'GET' ? undefined : JSON.stringify(body)
    };

    const response = await fetch(`${SERVER_API}/${path}`, options);
    const result = await response.json();
    console.log(result)

    if (!response.ok) {
      return {
        error: true,
        status: response.status,
        serverError: result.serverError || response.message,
      };
    }
    return result;
  } catch (err) {
    return {
      error: true,
      serverError: 'Unexpected error occurred. Please try again later',
    };
  }
}


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
    console.log(obj)

    const queryParams = new URLSearchParams(obj);

    const response = await fetch(`${SERVER_API}/random-words?${queryParams}`,
      { method: 'GET' }
    );

    const result = await response.json();
    console.log(result)
    return result;
  } catch (err) {
    console.error(err);
  }
}

//find word (and translate) in dictionary api, if text is shorter 3 words. Otherwise, use translation api
export async function translate({ langs, text, inDictionary }) {
  console.log({ langs, text, inDictionary })
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
      method: 'GET'
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
      method: 'GET'
    });
    const result = await response.json();
    return result;
  } catch (err) {
    console.error(err);
  }
}

export async function getUserData(token) {
  const headers = {'Authorization': `Bearer ${token}`};
  return fetchAPI('users/me', 'GET', headers);
}

export async function authorize(obj) {
  return fetchAPI('login', 'POST', undefined, obj);
}

export async function signup(obj) {
  return fetchAPI('signup', 'POST', undefined, obj);
}

//request link for password reset
export async function linkRequest(obj) {
  return fetchAPI('users/password-reset', 'POST', undefined, obj);
}

export async function updatePassword(params, body) {
  return fetchAPI(`users/password-reset/${params.userId}/${params.token}`, 'POST', undefined, body);
}

//add words to user learning list
export async function addToList(arr, token) {
  console.log(arr)
  const headers = {'Authorization': `Bearer ${token}`};
  return fetchAPI('userwords', 'POST', headers, arr);
}

//get user learning list
export async function getWordList(token) {
  console.log('req')
  const headers = {'Authorization': `Bearer ${token}`};
  return fetchAPI('userwords', 'GET', headers);
}



