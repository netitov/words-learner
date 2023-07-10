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
        handleLearnList={props.handleLearnList}
        compareFreq={props.compareFreq}
        translFreqs={props.translFreqs}
      />

      <Frequency
        setCharsFreq={props.setCharsFreq}
        wordFrequency={props.wordFrequency}
        frIsLoading={props.frIsLoading}
        frNoData={props.frNoData}
        handleLearnList={props.handleLearnList}
      />

      <RandomWords
        randomWords={props.randomWords}
        getFreqCat={props.getFreqCat}
        searchWords={props.searchWords}
        handleLearnList={props.handleLearnList}
        wordsAreLoading={props.wordsAreLoading}
        activeLangOutput={props.activeLangOutput}
        activeLangInput={props.activeLangInput}
        enDicLangs={props.enDicLangs}
        isActive={props.randomlangListActive}
        inputText={props.inputText}
        openLangList={props.openLangListWords}
        selectLang={props.selectLang}
        searchLang={props.searchLang}
      />

    </main>
  )
}

export default Main;
