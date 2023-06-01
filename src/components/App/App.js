import React, { useState, useEffect } from 'react';
import Header from '../Header/Header';
import Main from '../Main/Main';
import { translate, getLanguages, getDictionary } from '../../utils/api';

function App() {

  const [isLoading, setIsLoading] = useState(false);
  const [translation, setTranslation] = useState('');
  const [chars, setChars] = useState('');
  const [availLang, setAvailLang] = useState([]);
  const [langListActive, setLangListActive] = useState(false);
  const [activeLang, setActiveLang] = useState('Russian');
  const [filteredLang, setFilteredLang] = useState([]);
  const [inputText, setInputText] = useState('');
  const [dictionary, setDictionary] = useState([]);


  //take once, than grab from local storage
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
  async function getTranslation(data) {
    const translation = await translate({ text: data });
    setIsLoading(false);
    setTranslation(translation.text[0]);
  }

  //clear the text input
  function deleteText() {
    setChars('');
  }

  //call translate function
  useEffect(() => {
    if(chars.length > 0) {
      setIsLoading(true);
      const timeOutId = setTimeout(() => getTranslation(chars), 1500);
      return () => clearTimeout(timeOutId);
    } else {
      setTranslation('');
    }
  }, [chars]);


  //close popup available languages list on esc and overlay click
  useEffect(() => {
    function handleEscClose(e) {
      if (e.key === 'Escape') {
        setLangListActive(false);
      }
    }
    function handleOverlayClose (e) {
      if (!e.target.classList.contains('languages') && !e.target.classList.contains('translator__lang')
        && !e.target.classList.contains('languages__search') && !e.target.classList.contains('languages__list')) {
        setLangListActive(false);
      }
    }
    document.addEventListener('keyup', handleEscClose);
    document.addEventListener('click', handleOverlayClose);
  }, [])

  //open/close popup available languages list on lang btn click
  function openLangList() {
    setLangListActive(!langListActive);
    //drop previous data before opening
    if (!langListActive) {
      setInputText('');
      setFilteredLang(availLang);
    }
  }

  //select language for translation
  function selectLang(data) {
    setActiveLang(data)
  }

  //search language through translator
  function searchLang(data) {
    setInputText(data);
    const text = data.toLowerCase();
    const filteredArr = availLang.filter((i) => i.language.toLowerCase().includes(text));
    setFilteredLang(filteredArr);
  }

  function test(e) {
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
          activeLang={activeLang}
          searchLang={searchLang}
          inputText={inputText}
        />

      </div>
    </div>
  )
}

export default App;
