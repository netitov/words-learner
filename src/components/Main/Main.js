import React, { useState } from 'react';
import promoImg from '../../images/Picture.svg';
import Translate from '../Translator/Translator';
import Frequency from '../Frequency/Frequency';
import RandomWords from '../RandomWords/RandomWords';
import Promo from '../Promo/Promo';

function Main(props) {

  const [btnActive, setBtnActive] = useState(false);

  function handleBtn() {
    setBtnActive(!btnActive);
  }

  return (
    <main className='main'>

      <Promo />

      <Translate
        translate={props.translate}
        isLoading={props.isLoading}
        translation={props.translation}
        handleClear={props.handleClear}
        chars={props.chars}
        setChars={props.setChars}
        languages={props.languages}
        isActive={props.isActive}
        openLangList={props.openLangList}
        selectLang={props.selectLang}
        activeLangOutput={props.activeLangOutput}
        searchLang={props.searchLang}
        inputText={props.inputText}
        activeLangInput={props.activeLangInput}
        swapLangs={props.swapLangs}
        otherTransl={props.otherTransl}
        frequency={props.frequency}
        addTranslate={props.addTranslate}
        addToList={props.addToList}
        compareFreq={props.compareFreq}
        translFreqs={props.translFreqs}
      />

      <Frequency
        setCharsFreq={props.setCharsFreq}
        wordFrequency={props.wordFrequency}
        frIsLoading={props.frIsLoading}
        frNoData={props.frNoData}
        addToList={props.addToList}
      />

      <RandomWords
        randomWords={props.randomWords}
      />

    </main>
  )
}

export default Main;
