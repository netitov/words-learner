// src/hooks/useDataFetch.js
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { setLangList } from '../store/langList';
import { setDictionLangs } from '../store/dictionLangs';
import { setEnDictionLangs } from '../store/enDictionLangs';

import { getLanguages, getDictionary } from '../utils/api';

function useLangsFetch() {

  const dispatch = useDispatch();
  const [dataIsLoading, setDataIsLoading] = useState(true);
  const data = useSelector((state) => state.langList);


  useEffect(() => {
    if (data.length === 0) {
      Promise.all([
        getLanguages(),
        getDictionary()
      ])
        .then(([lang, dict]) => {
          //list of languages for translation
          const sortedLangs = lang.sort((a, b) => a.language.localeCompare(b.language));

          dispatch(setLangList(sortedLangs));

          //list of languages for translation in feat RandomWords (available for dictionary from english)
          const engDictionary = dict.filter((i) => i.languages.includes('en-'));
          const filteredLangs = sortedLangs.filter((i) => {
            return engDictionary.some((el) => i.code === el.languages.split('-')[1])
          })

          dispatch(setDictionLangs(dict));
          dispatch(setEnDictionLangs(filteredLangs));

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
