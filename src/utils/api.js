import { SERVER_API } from './config';

async function fetchAPI(path, method, headers, body) {
  try {
    const options = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...headers,
      },
      body: method === 'GET' ? undefined : JSON.stringify(body), //body must be an object
    };

    const response = await fetch(`${SERVER_API}/${path}`, options);
    const result = await response.json();

    if (!response.ok) {
      return {
        error: true,
        status: response.status,
        serverError: result.serverError || response.message,
      };
    } else {
      return result;
    }
  } catch (err) {
    return {
      error: true,
      serverError: 'Unexpected error occurred. Please try again later',
    };
  }
}

/* export async function checkFrequency(word) {
  try {
    const response = await fetch(`${SERVER_API}/word-data/${word}`,
      { method: 'GET' }
    );
    const result = await response.json();
    return result;
  } catch (err) {
    console.error(err);
  }
} */

//translate text
export async function translate({ langs, text, inDictionary }) {
  return fetchAPI('translate', 'POST', undefined, { langs, text, inDictionary });
}

//get words frequency
export async function checkFrequency(word) {
  return fetchAPI(`word-data/${word}`, 'GET');
}

//get list of available languages for translations from server
export async function getLanguages() {
  try {
    const response = await fetch(`${SERVER_API}/languages`, {
      method: 'GET',
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
    });
    const result = await response.json();
    return result;
  } catch (err) {
    console.error(err);
  }
}

export async function getUserData(token) {
  const headers = { Authorization: `Bearer ${token}` };
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
  const headers = { Authorization: `Bearer ${token}` };
  return fetchAPI('userwords', 'POST', headers, arr);
}

//delete word from user learning list
export async function deleteFromList(word, token) {
  const headers = { Authorization: `Bearer ${token}` };
  return fetchAPI(`userwords/${word}`, 'DELETE', headers);
}

//delete array of words from user learning list
export async function deleteArrayFromListDB(collectionId, token) {
  const headers = { Authorization: `Bearer ${token}` };
  return fetchAPI('userwords', 'DELETE', headers, collectionId);
}

//delete array of words from user learning list
export async function updateListDB(collectionId, token) {
  const headers = { Authorization: `Bearer ${token}` };
  return fetchAPI('userwords', 'PATCH', headers, collectionId);
}

//update translation of a word in DB
export async function updateWordTranslationAPI(wordObj, token) {
  const headers = { Authorization: `Bearer ${token}` };
  return fetchAPI(`userwords/${wordObj.word}`, 'PATCH', headers, wordObj);
}

//get user learning list
export async function getWordList(token) {
  const headers = { Authorization: `Bearer ${token}` };
  return fetchAPI('userwords', 'GET', headers);
}

//add quiz result to word list
export async function addResultToListAPI(wordObj, token) {
  const headers = { Authorization: `Bearer ${token}` };
  return fetchAPI('userwords/result', 'POST', headers, wordObj);
}

export async function getRandomWords(obj) {
  const queryParams = new URLSearchParams(obj);
  return fetchAPI(`random-words?${queryParams}`, 'GET');
}

//get user collections of words
export async function getCollections(token) {
  const headers = { Authorization: `Bearer ${token}` };
  return fetchAPI('collections', 'GET', headers);
}

//creare user colletions of words
export async function createCollectionAPI(collectionObj, token) {
  const headers = { Authorization: `Bearer ${token}` };
  return fetchAPI('collections', 'POST', headers, collectionObj);
}

//delete user collection
export async function deleteCollectionAPI(collectionId, token) {
  const headers = { Authorization: `Bearer ${token}` };
  return fetchAPI(`collections/${collectionId}`, 'DELETE', headers);
}

//update user collection
export async function updateCollectionAPI(collectionId, token, collectionObj) {
  const headers = { Authorization: `Bearer ${token}` };
  return fetchAPI(`collections/${collectionId}`, 'PATCH', headers, collectionObj);
}

//get words for quiz
export async function getQuizWordsAPI(wordsArr) {
  return fetchAPI('word-data-quiz', 'POST', undefined, wordsArr);
}

export async function getQuizResultsAPI(token) {
  const headers = { Authorization: `Bearer ${token}` };
  return fetchAPI('test', 'GET', headers);
}

export async function saveQuizDataAPI(token) {
  const headers = { Authorization: `Bearer ${token}` };
  return fetchAPI('test', 'POST', headers);
}
