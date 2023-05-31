import React, { useState, useEffect } from 'react';
import Header from '../Header/Header';
import Main from '../Main/Main';
import { translate, getLanguages } from '../../utils/api';

function App() {

  const [isLoading, setIsLoading] = useState(false);
  const [translation, setTranslation] = useState('');
  const [chars, setChars] = useState('');
  const [availLang, setAvailLang] = useState([]);
  const [langListActive, setLangListActive] = useState(false);
  const [activeLang, setActiveLang] = useState('Russian');

  //getLanguages();

  //get data from server
  useEffect(() => {
    Promise.all([
      getLanguages()
    ])
      .then(([lang]) => {
        //localStorage.setItem('standings', JSON.stringify(st));

        const sortedLangs = lang.sort((a, b) => a.language.localeCompare(b.language));
        setAvailLang(sortedLangs);
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


  //close popup on esc and overlay click
  useEffect(() => {
    function handleEscClose(e) {
      if (e.key === 'Escape') {
        setLangListActive(false);
      }
    }
    function handleOverlayClose (e) {
      if (!e.target.classList.contains('languages') && !e.target.classList.contains('translator__lang')
        && !e.target.classList.contains('languages__search')) {
        setLangListActive(false);
      }
    }
    document.addEventListener('keyup', handleEscClose);
    document.addEventListener('click', handleOverlayClose);
  }, [])

  //open popup available languages list
  function openLangList() {
    setLangListActive(!langListActive);
  }

  //select language for translation
  function selectLang(data) {
    setActiveLang(data)
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
          languages={availLang}
          isActive={langListActive}
          openLangList={openLangList}
          selectLang={selectLang}
          activeLang={activeLang}
        />

      </div>
    </div>
  )
}

export default App;
