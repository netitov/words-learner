import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addNewWords } from '../store/userWords';
import { addToList } from '../utils/api';
import { useSelector } from 'react-redux';

function useWordSave() {
  const [snackbarActive, setSnackbarActive] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const dispatch = useDispatch();

  const currentInputLang = useSelector((state) => state.inputLang);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const userWords = useSelector((state) => state.userWords);

  //prepare word for saving in learning list + check if user logged in
  async function handleWordSave(word, translation) {
    if (!isLoggedIn) {
      setSnackbarActive(true);
    } else if (isChecked) {
      setIsChecked(false);
      //delete word
    } else {
      setIsChecked(true);
      const userLang = JSON.parse(localStorage.getItem('userLang'));
      const obj = {
        word: userLang.lang === currentInputLang.lang ? translation : word,
        translation: userLang.lang === currentInputLang.lang ? word : translation,
        translationLang: userLang.code,
        source: ['-']
      }
      await saveWord(obj);
    }
  }

  //save word in user learning list
  async function saveWord(obj) {
    const token = localStorage.getItem('token');
    const arr = [obj];
    const response = await addToList(arr, token);
    if (response.err) {
      console.log(response.err);
      return response.err;
    } else {
      console.log(arr)
      dispatch(addNewWords(arr));
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

  return { handleWordSave, closeSnackbar, checkList, isChecked, snackbarActive } ;
}

export default useWordSave;
