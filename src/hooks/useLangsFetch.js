// src/hooks/useDataFetch.js
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { setLangList } from '../store/langList';
import { setDictionLangs } from '../store/dictionLangs';

import { getLanguages, getDictionary } from '../utils/api';

function useLangsFetch() {

  const dispatch = useDispatch();
  const [dataIsLoading, setDataIsLoading] = useState(true);
  const data = useSelector((state) => state.langList);


  useEffect(() => {
    if (!data) {
      Promise.all([
        getLanguages(),
        getDictionary()
      ])
        .then(([lang, dict]) => {
          //list of languages for translation
          const sortedLangs = lang.sort((a, b) => a.language.localeCompare(b.language));

          //redux test
          dispatch(setLangList(sortedLangs));

          //set initial user language
          //const userLang = getStorageItem(localStorage, 'userLang');

          /* if (userLang) {
            setActiveLangOutput(userLang);
          } else {
            setInitLang(sortedLangs);
          } */

          //list of languages for dictionary check
          //setDictionary(dict);

          //list of languages for translation in feat RandomWords (available for dictionary from english)
          const engDictionary = dict.filter((i) => i.languages.includes('en-'));
          const filteredLangs = sortedLangs.filter((i) => {
            return engDictionary.some((el) => i.code === el.languages.split('-')[1])
          })
          //setEnDicLangs(filteredLangs);
          //setEnDicLangsInit(filteredLangs);

          dispatch(setDictionLangs(filteredLangs));
          setDataIsLoading(false);

        })
        .catch((err) => {
          console.log(err);
        })
    } else {
      setDataIsLoading(false);
    }
  }, []);

  return { dataIsLoading };
};

export default useLangsFetch;
