import { addToList } from './api';

export async function saveWord(obj) {
  const token = localStorage.getItem('token');
  const arr = [];

  arr.push(obj);

  console.log(obj)

  const response = await addToList(arr, token);
  if (response.err) {
    console.log(response.err)
    return response.err;
  } else {
    //add new word to word list on session storage
    const currentArray = JSON.parse(sessionStorage.getItem('userWords')) || [];
    currentArray.unshift(obj);
    sessionStorage.setItem('userWords', JSON.stringify(currentArray));
    return currentArray;
  }
}
