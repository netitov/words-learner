import React, { useState } from 'react';
import { addNewWords, deleteWord, deleteWordsArray, updateWord, setUserWords } from '../store/userWords';
import { addToList, deleteFromList, deleteArrayFromListDB, updateListDB, updateWordTranslationAPI } from '../utils/api';
import { useSelector, useDispatch } from 'react-redux';
import { showError } from '../store/error';
import { errorMessages } from '../utils/constants';

function useWordSave() {
  const [snackbarActive, setSnackbarActive] = useState(false);//for error display
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
    //add to DB
    const addedWords = await addToList(arr, token);
    if (addedWords.error) {
      dispatch(showError(errorMessages.general));
      return addedWords.error;
    } else {
      //add bookmark icon
      setIsChecked(true);
      //update state and storage
      dispatch(addNewWords(addedWords));
      sessionStorage.setItem('userWords', JSON.stringify([...userWords, ...addedWords]));
      return addedWords;
    }
  };

  //remove word from user learning list
  async function removeWord(word) {
    const response = await deleteFromList(word, token);
    if (response.error) {
      dispatch(showError(errorMessages.general));
      return response.error;
    } else {
      //remove bookmark icon
      setIsChecked(false);
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
      dispatch(showError(errorMessages.general));
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
      dispatch(showError(errorMessages.general));
      return updatedWords.error;
    } else if (updatedWords.length > 0) {
      //update storage and state
      dispatch(setUserWords(updatedWords));
      sessionStorage.setItem('userWords', JSON.stringify(updatedWords));
    }
    return updatedWords;
  };

  //update word data in DB
  async function updateWordData(word, translation) {

    if (!isLoggedIn) {
      setSnackbarActive(true);
      //isSaved: for words saving from dictionary
    } else {
      const wordsStorage = JSON.parse(sessionStorage.getItem('userWords'));

      const updatedWord = await updateWordTranslationAPI({ word, translation }, token);

      if (updatedWord.error) {
        dispatch(showError(errorMessages.general));
        return updatedWord.error;
      } else {
        //update storage and state
        dispatch(updateWord(updatedWord));

        //update session storage
        const updatedWords = wordsStorage?.map(wordObj => {
          return wordObj._id ===  updatedWord._id ? updatedWord : wordObj;
        });
        sessionStorage.setItem('userWords', JSON.stringify(updatedWords));
      }
      return updatedWord;
    }

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
   async function handleWordList(text, translation, isSaved, isDictionary) {
    const userLang = JSON.parse(localStorage.getItem('userLang'));
    const word = userLang.lang === currentInputLang.lang ? translation : text;
    //show error-message if user is not logged in
    if (!isLoggedIn) {
      setSnackbarActive(true);
      //isSaved: for words saving from dictionary
    } else if ((isChecked && !isDictionary) || isSaved) {
      //remove words if it's saved
      await removeWord(word);
    } else {
      const sourceData = collections.find(i => i.default);
      const obj = {
        word,
        translation: userLang.lang === currentInputLang.lang ? text : translation,
        translationLang: userLang.code,
        source: sourceData ? [{ collectionId: sourceData._id, collectionName: sourceData.collectionName }] : []
      }
      await saveWord(obj);
    }
  }

  return { handleWordList, closeSnackbar, checkList, isChecked, setIsChecked, snackbarActive,
    removeWord, removeWordList, updateCollectionData, updateWordData
  } ;
}

export default useWordSave;
