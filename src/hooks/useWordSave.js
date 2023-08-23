import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addNewWords, deleteWord, deleteWordsArray, updateWordState, setUserWords } from '../store/userWords';
import { addToList, deleteFromList, deleteArrayFromListDB, updateListDB } from '../utils/api';
import { useSelector } from 'react-redux';

function useWordSave() {
  const [snackbarActive, setSnackbarActive] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const dispatch = useDispatch();

  const currentInputLang = useSelector((state) => state.inputLang);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const userWords = useSelector((state) => state.userWords);
  const collections = useSelector((state) => state.collections);

  const token = localStorage.getItem('token');

  //save word in user learning list
  async function saveWord(obj) {
    const arr = [obj];
    const addedWords = await addToList(arr, token);
    if (addedWords.error) {
      return addedWords.error;
    } else {
      dispatch(addNewWords(addedWords));
      sessionStorage.setItem('userWords', JSON.stringify([...userWords, ...addedWords]));
      return addedWords;
    }
  };

  //remove word from user learning list
  async function removeWord(word) {
    const response = await deleteFromList(word, token);
    if (response.error) {
      return response.error;
    } else {
      //update state
      dispatch(deleteWord(word));
      //update storage
      const wordsStorage = JSON.parse(sessionStorage.getItem('userWords'));
      const updatedUserWordsArray = wordsStorage.filter(i => i.word !== word);
      sessionStorage.setItem('userWords', JSON.stringify(updatedUserWordsArray));

      return response.data;
    }
  };

  //remove word list from user learning list
  async function removeWordList(collectionId) {
    const updatedWords = await deleteArrayFromListDB({ collectionId }, token);
    if (updatedWords.error) {
      return updatedWords.error;
    } else if (updatedWords.length > 0) {
      //update storage and state
      dispatch(setUserWords(updatedWords));
      sessionStorage.setItem('userWords', JSON.stringify(updatedWords));
    }
    return updatedWords;
  };

  async function updateCollectionData(collectionId) {
    const updatedWords = await updateListDB({ collectionId }, token);
    if (updatedWords.error) {
      console.log(updatedWords.error);
    } else if (updatedWords.length > 0) {
      //update storage and state
      dispatch(setUserWords(updatedWords));
      sessionStorage.setItem('userWords', JSON.stringify(updatedWords));
    }
    return updatedWords;
  };

  function closeSnackbar() {
    setSnackbarActive(false);
  };

  //check if word in user word list
  function checkList(translation, text) {
    if (userWords.some((i) => i.word === translation || i.word === text)) {
      setIsChecked(true);
    } else {
      setIsChecked(false);
    }
  }

   //prepare word for saving/ deleting in learning list + check if user logged in
   async function handleWordList(text, translation) {
    const userLang = JSON.parse(localStorage.getItem('userLang'));
    const word = userLang.lang === currentInputLang.lang ? translation : text;
    if (!isLoggedIn) {
      setSnackbarActive(true);
    } else if (isChecked) {
      setIsChecked(false);
      await removeWord(word);
    } else {
      setIsChecked(true);
      const sourceData = collections.find(i => i.default);
      const obj = {
        word,
        translation: userLang.lang === currentInputLang.lang ? word : translation,
        translationLang: userLang.code,
        source: sourceData ? [{ collectionId: sourceData._id, collectionName: sourceData.collectionName }] : []
      }
      await saveWord(obj);
    }
  }

  return { handleWordList, closeSnackbar, checkList, isChecked, snackbarActive, removeWord, removeWordList, updateCollectionData } ;
}

export default useWordSave;
