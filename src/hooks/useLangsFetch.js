import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { setLangList } from '../store/langList';
import { setDictionLangs } from '../store/dictionLangs';
import { setEnDictionLangs } from '../store/enDictionLangs';

import { getLanguages, getDictionary } from '../utils/api';

function useLangsFetch() {
  const dispatch = useDispatch();
  const [langsLoaded, setLangsLoaded] = useState(true);
  const data = useSelector((state) => state.langList);

  const langList = JSON.parse(localStorage.getItem('langList'));
  const dictionLangs = JSON.parse(localStorage.getItem('dictionLangs'));
  const enDictionLangs = JSON.parse(localStorage.getItem('enDictionLangs'));

  useEffect(() => {
    if (data.length === 0) {
      if (!langList || !dictionLangs || !enDictionLangs) {
        Promise.all([getLanguages(), getDictionary()])
          .then(([lang, dict]) => {
            //list of languages for translation
            const sortedLangs = lang.sort((a, b) => a.language.localeCompare(b.language));

            dispatch(setLangList(sortedLangs));
            localStorage.setItem('langList', JSON.stringify(sortedLangs));

            //list of languages for translation in feat RandomWords (available for dictionary from english)
            const engDictionary = dict.filter((i) => i.languages.includes('en-'));
            const filteredLangs = sortedLangs.filter((i) => {
              return engDictionary.some((el) => i.code === el.languages.split('-')[1]);
            });

            dispatch(setDictionLangs(dict));
            localStorage.setItem('dictionLangs', JSON.stringify(dict));

            dispatch(setEnDictionLangs(filteredLangs));
            localStorage.setItem('enDictionLangs', JSON.stringify(filteredLangs));

            setLangsLoaded(false);
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        dispatch(setLangList(langList));
        dispatch(setDictionLangs(dictionLangs));
        dispatch(setEnDictionLangs(enDictionLangs));

        setLangsLoaded(false);
      }
    } else {
      setLangsLoaded(false);
    }
  }, []);

  return { langsLoaded };
}

export default useLangsFetch;
