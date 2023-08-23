import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addNewWords, deleteWord, deleteWordsArray, updateWordState } from '../store/userWords';
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
    const response = await addToList(arr, token);
    if (response.error) {
      return response.error;
    } else {
      dispatch(addNewWords(arr));
      sessionStorage.setItem('userWords', JSON.stringify([...userWords, ...arr]));
      return response.data;
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
    const deletedWords = await deleteArrayFromListDB({ collectionId }, token);
    if (deletedWords.error) {
      return deletedWords.error;
    } else if (deletedWords.length > 0) {
      //update state
      dispatch(deleteWordsArray(deletedWords));
      //update storage
      const wordsStorage = JSON.parse(sessionStorage.getItem('userWords'));
      const wordsToDelete = deletedWords.map(wordObj => wordObj._id);
      const updatedUserWordsArray = wordsStorage.filter(word => !wordsToDelete.includes(word._id));
      sessionStorage.setItem('userWords', JSON.stringify(updatedUserWordsArray));
    }
    return deletedWords;
  };

  async function updateCollectionData(collectionId) {
    const updatedWords = await updateListDB({ collectionId }, token);
    if (updatedWords.error) {
      console.log(updatedWords.error);
    } else if (updatedWords.length > 0) {
      //update state
      dispatch(updateWordState(updatedWords));
      //update storage
      const wordsStorage = JSON.parse(sessionStorage.getItem('userWords'));
      const wordsToUpdate = updatedWords.map(wordObj => wordObj._id);
      const newList = wordsStorage.map(wordObj => {
        const matchingUpdatedWords = wordsToUpdate.find(i => i._id === wordObj._id);
        return matchingUpdatedWords ? matchingUpdatedWords : wordObj;
      });
      sessionStorage.setItem('userWords', JSON.stringify(newList));
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
      const sourceData = collections.find(i => i.default) || { _id: '', collectionName: '' };
      const obj = {
        word,
        translation: userLang.lang === currentInputLang.lang ? word : translation,
        translationLang: userLang.code,
        source: [{ collectionId: sourceData._id, collectionName: sourceData.collectionName }]
      }
      await saveWord(obj);
    }
  }

  return { handleWordList, closeSnackbar, checkList, isChecked, snackbarActive, removeWord, removeWordList, updateCollectionData } ;
}

export default useWordSave;
