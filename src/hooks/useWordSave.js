import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addNewWords, deleteWord } from '../store/userWords';
import { addToList, deleteFromList } from '../utils/api';
import { useSelector } from 'react-redux';

function useWordSave() {
  const [snackbarActive, setSnackbarActive] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const dispatch = useDispatch();

  const currentInputLang = useSelector((state) => state.inputLang);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const userWords = useSelector((state) => state.userWords);

  const token = localStorage.getItem('token');


  //save word in user learning list
  async function saveWord(obj) {
    const arr = [obj];
    const response = await addToList(arr, token);
    if (response.err) {
      return response.err;
    } else {
      dispatch(addNewWords(arr));
      sessionStorage.setItem('userWords', JSON.stringify([...userWords, ...arr]));
      return response.data;
    }
  };

  //save word in user learning list
  async function removeWord(word) {
    const response = await deleteFromList(word, token);
    if (response.err) {
      return response.err;
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
      const obj = {
        word,
        translation: userLang.lang === currentInputLang.lang ? word : translation,
        translationLang: userLang.code,
        source: ['-']
      }
      await saveWord(obj);
    }
  }

  return { handleWordList, closeSnackbar, checkList, isChecked, snackbarActive, removeWord } ;
}

export default useWordSave;
