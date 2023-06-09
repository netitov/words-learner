import React, { useState, useEffect } from 'react';
import Header from '../Header/Header';
import Main from '../Main/Main';
import { translate, getLanguages, getDictionary, checkFrequency } from '../../utils/api';

function App() {

  const [isLoading, setIsLoading] = useState(false);
  const [translation, setTranslation] = useState('');
  const [chars, setChars] = useState('');
  const [availLang, setAvailLang] = useState([]);
  const [langListActive, setLangListActive] = useState({ type: '', value: false });
  const [activeLangInput, setActiveLangInput] = useState({ lang: 'English', code: 'en' });
  const [activeLangOutput, setActiveLangOutput] = useState({ lang: 'Russian', code: 'ru' });
  const [filteredLang, setFilteredLang] = useState([]);
  const [inputText, setInputText] = useState('');
  const [dictionary, setDictionary] = useState([]);
  const [otherTransl, setOtherTransl] = useState([]);
  const [frequency, setFrequency] = useState({ word: '', fr: 0, text: '' });
  const [translFreqs, setTranslFreqs] = useState([]);


  //take once, than grab from local storage. How to update it?
  //get data from server
  useEffect(() => {
    Promise.all([
      getLanguages(),
      getDictionary()
    ])
      .then(([lang, dict]) => {
        //localStorage.setItem('standings', JSON.stringify(st));

        //list of languages for translation
        const sortedLangs = lang.sort((a, b) => a.language.localeCompare(b.language));
        setAvailLang(sortedLangs);
        setFilteredLang(sortedLangs);

        //list of languages for translation
        setDictionary(dict);
      })
      .catch((err) => {
        console.log(err);
      })
  }, []);

  //get translation; switch the spinner
  async function getTranslation(text) {
    //get translation
    const langs = activeLangInput.code + '-' + activeLangOutput.code;
    const inDictionary = dictionary.some((i) => i.languages === langs);
    const response = await translate({ langs, text, inDictionary });
    setIsLoading(false);

    //use translation
    const translation = response.text === undefined ? response[0].tr[0].text : response.text[0];
    const otherTranslations = (response.text === undefined && response.length > 0) ? response : [];
    setTranslation(translation);
    setOtherTransl(otherTranslations);
    setTranslFreqs([]);

    //get frequency if english is selected
    if (chars.split(' ').length === 1) {
      if (activeLangInput.lang === 'English') {
        getFrequency(chars);
      } else if (activeLangOutput.lang === 'English') {
        getFrequency(translation);
      } else setFrequency({ word: '', fr: 0, text: '' });
    }
  }

  //get word frequency
  async function getFrequency(word) {
    const response = await checkFrequency(word);
    const obj = response[0];

    const getText = () => {
      if (obj.fr < 2) {
        return 'very low';
      } else if (obj.fr < 4) {
        return 'low';
      } else if (obj.fr < 6) {
        return 'high';
      } else return 'very high';
    }
    setFrequency({ word, fr: obj.fr, text: getText() })
  }

  //clear the text input
  function deleteText() {
    setChars('');
  }

  //call translate function
  useEffect(() => {
    if(chars.length > 0) {
      setIsLoading(true);
      const timeOutId = setTimeout(() => getTranslation(chars),1500);//delay before start translating
      return () => clearTimeout(timeOutId);
    } else {
      setTranslation('');
      setOtherTransl([]);
      setIsLoading(false);
      setFrequency({ word: '', fr: 0, text: '' });
      setTranslFreqs([]);

    }
  }, [chars, activeLangInput, activeLangOutput]);


  //close popup available languages list on esc and overlay click
  useEffect(() => {
    function handleEscClose(e) {
      if (e.key === 'Escape') {
        setLangListActive({ value: false });
      }
    }
    function handleOverlayClose (e) {
      if (!e.target.classList.contains('languages') && !e.target.classList.contains('translator__lang')
        && !e.target.classList.contains('languages__search') && !e.target.classList.contains('languages__list')) {
        setLangListActive({ value: false });
      }
    }
    document.addEventListener('keyup', handleEscClose);
    document.addEventListener('click', handleOverlayClose);

    return () => {
      document.removeEventListener('keyup', handleEscClose);
      document.removeEventListener('click', handleOverlayClose);
    };
  }, [])

  //open/close popup available languages list on lang btn click
  function openLangList(type) {

    if (type === langListActive.type) {
      setLangListActive({ type: '', value: false });
    } else {
      dropSearch();
      setLangListActive({ type: type, value: true });
    }
    //drop previous data before opening
    if (!langListActive.value) {
      dropSearch();
    }
  }

  //select language for translation
  function selectLang(lang, type, code) {
    if (type === 'input') {
      setActiveLangInput({ lang, code });
    } else {
      setActiveLangOutput({ lang, code });
    }
  }

  function dropSearch() {
    setInputText('');
    setFilteredLang(availLang);
  }

  //search language through translator
  function searchLang(data) {
    setInputText(data);
    const text = data.toLowerCase();
    const filteredArr = availLang.filter((i) => i.language.toLowerCase().includes(text));
    setFilteredLang(filteredArr);
  }

  function swapLangs() {
    setActiveLangInput(activeLangOutput);
    setActiveLangOutput(activeLangInput);
    setChars(translation);
    setTranslation(chars);
  }

  //translate on word click
  function addTranslate(text, swap) {
    setChars(text);
    setTranslation('');
    if (swap) {
      setActiveLangInput(activeLangOutput);
      setActiveLangOutput(activeLangInput);
    }
  }

  function addToList() {

  }

  //compare words frequency
  async function compareFreq(data, translation) {
    const wordsArr = [];

    if (translation) {
      wordsArr.push(data.text);
      data.syn?.forEach((i) => wordsArr.push(i.text));
    } else {
      Array.isArray(data) ? data.forEach((obj) => wordsArr.push(obj.text)) : wordsArr.push(data);
    }

    const workdsStr = wordsArr.filter(i => !i.includes(' ')).join(',');
    const response = await checkFrequency(workdsStr);

    const foundFreqs = !response.some(i => i.word === frequency.word) ? [frequency, ...response] : response;
    setTranslFreqs(foundFreqs);
  }

  function test() {

  }

  return (
    <div className='page' onClick={test}>
      <div className='page__wrapper'>
        <Header />
        <Main
          translate={getTranslation}
          isLoading={isLoading}
          translation={translation}
          handleClear={deleteText}
          chars={chars}
          setChars={setChars}
          languages={filteredLang}
          isActive={langListActive}
          openLangList={openLangList}
          selectLang={selectLang}
          activeLangOutput={activeLangOutput}
          searchLang={searchLang}
          inputText={inputText}
          activeLangInput={activeLangInput}
          swapLangs={swapLangs}
          otherTransl={otherTransl}
          frequency={frequency}
          addTranslate={addTranslate}
          addToList={addToList}
          compareFreq={compareFreq}
          translFreqs={translFreqs}
        />

      </div>
    </div>
  )
}

export default App;
