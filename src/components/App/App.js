import React, { useState, useEffect } from 'react';
import Header from '../Header/Header';
import Main from '../Main/Main';
import { translate, getLanguages } from '../../utils/api';

function App() {

  const [isLoading, setIsLoading] = useState(false);
  const [translation, setTranslation] = useState('');
  const [chars, setChars] = useState('');
  const [availLang, setAvailLang] = useState([]);

  //getLanguages();

  //get data from server
  useEffect(() => {
    Promise.all([
      getLanguages()
    ])
      .then(([lang]) => {
        //localStorage.setItem('standings', JSON.stringify(st));
        setAvailLang(lang);
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

  function test() {
    console.log(availLang)
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
        />

      </div>
    </div>
  )
}

export default App;
