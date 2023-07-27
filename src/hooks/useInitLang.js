import { useDispatch } from 'react-redux';
import { selectOutputLang } from '../store/outputLang';
import { defaultLang } from '../utils/constants';

export function useInitLang() {

  const dispatch = useDispatch();

  function getUserLang() {
    const userLang = navigator.language || navigator.userLanguage;
    if (!userLang.includes('en')) {
      return userLang.split('-')[0];
    } else if (navigator.languages.some((i) => !i.includes('en'))) {
      return navigator.languages.find((i) => !i.includes('en')).split('-')[0];
    } else {
      return 'es';
    }
  }

  function setInitLang(arr) {
    const userLang = getUserLang();
    const foundLang = arr.find((i) => i.code === userLang);
    const activeLangOutput = foundLang
      ? { lang: foundLang.language, code: foundLang.code }
      : defaultLang;

    //setActiveLangOutput(activeLangOutput);
    dispatch(selectOutputLang(activeLangOutput));

    // save to local storage
    localStorage.setItem('userLang', JSON.stringify(activeLangOutput));
  }

  // Если вам не нужно возвращать функции, просто верните пустой объект или null
  return { setInitLang };
}
