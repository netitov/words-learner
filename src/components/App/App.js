import React, { useState, useEffect } from 'react';
import Header from '../Header/Header';
import Main from '../Main/Main';
import { translate, getLanguages, getDictionary } from '../../utils/api';

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
    const langs = activeLangInput.code + '-' + activeLangOutput.code;
    const inDictionary = dictionary.some((i) => i.languages === langs);
    const response = await translate({ langs, text, inDictionary });
    setIsLoading(false);

    const translation = response.text === undefined ? response[0].tr[0].text : response.text[0];
    const otherTranslations = (response.text === undefined && response.length > 0) ? response : [];
    setTranslation(translation);
    setOtherTransl(otherTranslations);
  }

  //clear the text input
  function deleteText() {
    setChars('');
  }

  //call translate function
  useEffect(() => {
    if(chars.length > 0) {
      setIsLoading(true);
      const timeOutId = setTimeout(() => getTranslation(chars), 1500);//delay before start translating
      return () => clearTimeout(timeOutId);
    } else {
      setTranslation('');
      setOtherTransl([]);
      setIsLoading(false);
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
        />

      </div>
    </div>
  )
}

export default App;
