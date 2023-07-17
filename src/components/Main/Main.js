import React, { useState } from 'react';
import promoImg from '../../images/Picture.svg';
import Translate from '../Translator/Translator';
import Frequency from '../Frequency/Frequency';
import RandomWords from '../RandomWords/RandomWords';
import Promo from '../Promo/Promo';
import Quiz from '../Quiz/Quiz';
import About from '../About/About';

function Main(props) {

  const [btnActive, setBtnActive] = useState(false);

  function handleBtn() {
    setBtnActive(!btnActive);
  }

  return (
    <main className='main'>

      <Promo />

      <About />

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

      <div className='main__quiz' id='quiz'>
        <h2 className='main__heading heading2'>Learn and test yourself</h2>
        <div className='main__quiz-container'>
          <div className='main__block-disciption'>
            <p>Take the tests and check your progress.</p>
            <p>Use filters above to update the word list</p>
          </div>
          <button className='main__quiz-btn' type='button' onClick={props.setQuizActive}>Start test</button>
        </div>
        <Quiz
          quizActive={props.quizActive}
          closeQuiz={props.closeQuiz}
          quizQuestions={props.quizQuestions}
          searchWords={props.searchWords}
          filters={props.filters}
        />
      </div>

    </main>
  )
}

export default Main;
