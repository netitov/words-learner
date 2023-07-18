import React, { useState, useEffect } from 'react';
import Header from '../Header/Header';
import Main from '../Main/Main';
import Footer from '../Footer/Footer';

import { translate, getLanguages, getDictionary, checkFrequency, getRandomWords } from '../../utils/api';
import { defaultLang } from '../../utils/constants';

function App() {

  const [isLoading, setIsLoading] = useState(false);
  const [translation, setTranslation] = useState('');
  const [chars, setChars] = useState('');
  const [availLang, setAvailLang] = useState([]);
  const [langListActive, setLangListActive] = useState({ type: '', value: false });
  const [activeLangInput, setActiveLangInput] = useState({ lang: 'English', code: 'en' });
  const [activeLangOutput, setActiveLangOutput] = useState({ lang: '', code: '' });
  const [filteredLang, setFilteredLang] = useState([]);
  const [inputText, setInputText] = useState('');
  const [dictionary, setDictionary] = useState([]);
  const [otherTransl, setOtherTransl] = useState([]);
  const [frequency, setFrequency] = useState({ word: '', fr: 0, text: '', filmPer: 0 });
  const [translFreqs, setTranslFreqs] = useState([]);
  const [charsFreq, setCharsFreq] = useState('');
  const [wordFreq, setWordFreq] = useState({ word: '', fr: 0, text: '', filmPer: 0 });
  const [frIsLoading, setFrIsLoading] = useState(false);
  const [frNoData, setFrNoData] = useState(false);
  const [randomWords, setRandomWords] = useState([]);
  const [wordsAreLoading, setWordsAreLoading] = useState(false);
  const [enDicLangs, setEnDicLangs] = useState([]);//list of languages supporning dictionary translation from english
  const [enDicLangsInit, setEnDicLangsInit] = useState([]);
  const [randomlangListActive, setRandomlangListActive] = useState({ type: 'random', value: false });
  const [filters, setFilters] = useState({
    frSt: 3,
    frEn: 5.5
  });
  const [quizActive, setQuizActive] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState([]);

  //check key in local storage
  function getStorageItem(storage, key) {
    const item = storage.getItem(key);
    return item !== null ? JSON.parse(item) : null;
  }

  function getUserLang() {
    const userLang = navigator.language || navigator.userLanguage;
    if (!userLang.includes('en')) {
      return userLang.split('-')[0];
    } else if (navigator.languages.some((i) => !i.includes('en'))) {
      return navigator.languages.find((i) => !i.includes('en')).split('-')[0];
    } else {
      return 'es';
    }
  }

  //set defalut user and add data to local storage
  function setInitLang(arr) {
    const userLang = getUserLang();
    const foundLang = arr.find((i) => i.code === userLang);
    const activeLangOutput = foundLang
      ? { lang: foundLang.language, code: foundLang.code }
      : defaultLang;

    setActiveLangOutput(activeLangOutput);

    //save to local storage
    localStorage.setItem('userLang', JSON.stringify(activeLangOutput));
  }

  //add frequency category
  function getFreqCat(fr) {
    if (fr < 2) {
      return 'very low';
    } else if (fr < 4) {
      return 'low';
    } else if (fr < 6) {
      return 'high';
    } else return 'very high';
  }

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

        //set initial user language
        const userLang = getStorageItem(localStorage, 'userLang');

        if (userLang) {
          setActiveLangOutput(userLang);
        } else {
          setInitLang(sortedLangs);
        }

        //list of languages for dictionary check
        setDictionary(dict);

        //list of languages for translation in feat RandomWords (available for dictionary from english)
        const engDictionary = dict.filter((i) => i.languages.includes('en-'));
        const filteredLangs = sortedLangs.filter((i) => {
          return engDictionary.some((el) => i.code === el.languages.split('-')[1])
        })
        setEnDicLangs(filteredLangs);
        setEnDicLangsInit(filteredLangs);
      })
      .catch((err) => {
        console.log(err);
      })
  }, []);

  async function requestRandomWords(filters) {
    const response = await getRandomWords(filters);
    const lang = filters.lang;
    const newObj = response.map((i) => {
      const frCat = getFreqCat(i.fr)
      return { ...i, frCat, lang }
    })
    sessionStorage.setItem('randomWords', JSON.stringify(newObj));
    setRandomWords(newObj);
    setWordsAreLoading(false);
  }

  // get inital list of random words/ update word list of languages was changed
  useEffect(() => {
    const wordStorage = getStorageItem(sessionStorage, 'randomWords');
    const quizStorage = getStorageItem(sessionStorage, 'quizQuestions');

    const currLang = JSON.parse(localStorage.getItem('userLang'));

    //if language were not changed, use list of words from session storage
    if (wordStorage?.some((i) => i.lang === currLang.code)) {
      setRandomWords(wordStorage);
      setQuizQuestions(quizStorage);
    } else {
      setWordsAreLoading(true);

      //use current filters, but update the language
      const newFilters = {
        ...filters,
        lang: currLang.code
      }

      let timer;

      function delayedRequestRandomWords() {
        timer = setTimeout(async() => {
          await requestRandomWords(newFilters);
          updateQuizQuestions();
        }, 2000);
      }

      delayedRequestRandomWords();

      setFilters(newFilters);

      return () => clearTimeout(timer);
    }
  }, [activeLangOutput, activeLangInput]);

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
  async function getFrequency(word, onlyFreq) {
    const response = await checkFrequency(word);

    if (response.length > 0) {
      const obj = response[0];
      const frequencyNumber = obj.fr;

      if (onlyFreq) {
        //for feat search frequency (without translate)
        setWordFreq({ word, fr: frequencyNumber, text: getFreqCat(frequencyNumber), filmPer: obj.filmPer });
      } else {
        //for feat translate
        setFrequency({ word, fr: frequencyNumber, text: getFreqCat(frequencyNumber), filmPer: obj.filmPer });
      }
    } else if(onlyFreq) {
      setWordFreq({ word: '', fr: 0, text: '', filmPer: 0 });
      setFrNoData(true);
    } else {
      setFrequency({ word: '', fr: 0, text: '', filmPer: 0 });
    }
    setFrIsLoading(false);
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
      setFrequency({ word: '', fr: 0, text: '', filmPer: 0 });
      setTranslFreqs([]);
    }
  }, [chars, activeLangInput, activeLangOutput]);

  //call search frequency function
  useEffect(() => {
    //drop error 'no data'
    setFrNoData(false);

    if(charsFreq.length > 0) {
      //delay for spinner
      const timeOutLoading = setTimeout(() => setFrIsLoading(true), 500);
      //delay before api request
      const timeOutRequest = setTimeout(() => getFrequency(charsFreq, true),1500);
      return () => {
        clearTimeout(timeOutRequest);
        clearTimeout(timeOutLoading);
      };
    } else {
      setFrIsLoading(false);
      setWordFreq({ word: '', fr: 0, text: '', filmPer: 0 });
    }
  }, [charsFreq]);

  //close popup available languages list on esc and overlay click
  useEffect(() => {
    function handleEscClose(e) {
      if (e.key === 'Escape') {
        setLangListActive({ value: false });
      }
    }
    function handleOverlayClose (e) {
      if (!e.target.classList.contains('languages') && !e.target.classList.contains('translator__lang')
        && !e.target.classList.contains('languages__search') && !e.target.classList.contains('languages__list')
        && !e.target.classList.contains('wtable__th_btn')) {
        //if lang list open from random words than close it, ohterwise close list in translation
        randomlangListActive.value ? setRandomlangListActive({ value: false }) : setLangListActive({ value: false });
      }
    }
    document.addEventListener('keyup', handleEscClose);
    document.addEventListener('click', handleOverlayClose);

    return () => {
      document.removeEventListener('keyup', handleEscClose);
      document.removeEventListener('click', handleOverlayClose);
    };
  }, [randomlangListActive, langListActive])

  //open/close popup available languages list on lang btn click
  function openLangList(type) {
    if (type === langListActive.type) {
      setLangListActive({ type: '', value: false });
    }
    else {
      dropSearch();
      setLangListActive({ type: type, value: true });
      setRandomlangListActive({ value: false })
    }

    //drop previous data before opening
    if (!langListActive.value) {
      dropSearch();
    }
  }

   //open/close popup available languages list on lang btn click from table Random words
  function openLangListWords(type) {
    if (type === randomlangListActive.type) {
      setRandomlangListActive({ type: '', value: false });
    }
    else {
      dropSearch();
      setRandomlangListActive({ type: type, value: true });
      setLangListActive({ type: '', value: false });
    }

    //drop previous data before opening
    if (!randomlangListActive.value) {
      dropSearch();
    }
  }

  //select language for translation
  function selectLang(lang, type, code) {

    //if lang list is opened from block random words
    if (randomlangListActive.value) {
      activeLangOutput.code === 'en' ? setActiveLangInput({ lang, code }) : setActiveLangOutput({ lang, code });
    } else if (type === 'input') {
      setActiveLangInput({ lang, code });
    } else {
      setActiveLangOutput({ lang, code });
    }

    //update/save user language on local storage
    if (code !== 'en') {
      localStorage.setItem('userLang', JSON.stringify({ lang, code }));
    }
  }

  function dropSearch() {
    setInputText('');
    setFilteredLang(availLang);
    setEnDicLangs(enDicLangsInit);
  }

  //search language through translator
  function searchLang(data) {
    const languages = randomlangListActive.value ? enDicLangsInit : availLang;
    setInputText(data);
    const text = data.toLowerCase();
    const filteredArr = languages.filter((i) => i.language.toLowerCase().includes(text));

    if (randomlangListActive.value) {
      setEnDicLangs(filteredArr);
    } else {
      setFilteredLang(filteredArr);
    }
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

  function handleLearnList(data) {
    console.log(data)
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

  function updateQuizQuestions() {
    const quizArr = createQuizQuestions();
    setQuizQuestions(quizArr);
    sessionStorage.setItem('quizQuestions', JSON.stringify(quizArr));
  }

  //search random words
  async function searchWords(filters) {
    //check of words are not already on loading
    if (!wordsAreLoading) {
      const currLang = JSON.parse(localStorage.getItem('userLang'));
      const newFilters = {
        ...filters,
        lang: currLang.code
      }

      setWordsAreLoading(true);
      setFilters(newFilters);
      await requestRandomWords(newFilters);

      updateQuizQuestions();
    }
  }

  function startQuiz() {
    setQuizActive(true);
  }

  function closeQuiz(e) {
    setQuizActive(false);
  }


  //create questions and answers for quiz (from random words)
  function createQuizQuestions() {
    const wordStorage = getStorageItem(sessionStorage, 'randomWords');
    const allWords = [];
    const quizArr = [];
    const mainWords = [];

    wordStorage.forEach((i) => {
      const obj = { word: i.translation, translation: i.word, pos: i.pos.toLowerCase() };
      allWords.push(obj);
      mainWords.push(obj);

      i.otherTransl.forEach((o) => {

        o.tr.forEach((el) => {
           if(!allWords.some((word) => word.word === el.text)) {
            const obj = { word: el.text, pos: el.pos, syn: i.translation };
            allWords.push(obj);
           }
        })

      })

    })

    mainWords.forEach((i) => {
      const obj = {
        question: i.translation,
        correctAnswer: i.word,
        pos: i.pos,
        options: []
      };

      const filteredWords = allWords.filter((el) => {
        return el.word !== obj.correctAnswer && el.syn !== obj.correctAnswer /* && el.pos === obj.pos */
        }

      );

      while (obj.options.length < 3) {
        const randomIndex = Math.floor(Math.random() * filteredWords.length);

        const newOpt = filteredWords[randomIndex].word;

        if (!obj.options.some((opt) => opt === newOpt)) {
          obj.options.push(newOpt);
        }
      }

      quizArr.push(obj);

      const randomIndexinArr = Math.floor(Math.random() * 4);
      obj.options.splice(randomIndexinArr, 0, obj.correctAnswer);

    })

    return quizArr;
  }

  //update quiz questions of randomWords were changed
  /* useEffect(() => {
    if (randomWords.length > 0) {

      const quizStorage = JSON.parse(sessionStorage.getItem('quizQuestions'));

      function compareArrays() {
        if (quizStorage === null) {
          return false;
        }
        if (randomWords.filter((i) => quizStorage?.some((q) => i.word === q.question)).length === quizStorage.length) {
          return true;
        } else {
          return false;
        }
      }

      const arraysAreSame = compareArrays();

      if (!arraysAreSame) {
        const quizArr = createQuizQuestions();
        setQuizQuestions(quizArr);
        sessionStorage.setItem('quizQuestions', JSON.stringify(quizArr));
      } else {
        setQuizQuestions(quizStorage);
      }
    }

    console.log('effect updated')

  }, [randomWords]) */

   //close quiz on esc and overlay
   useEffect(() => {
    function handleEscClose(e) {
      if (e.key === 'Escape') {
        setQuizActive(false);
      }
    }

    function handleOverlayClose(e) {
      if (e.target.classList[0] === 'quiz') {
        setQuizActive(false);
      }
    }
    document.addEventListener('keyup', handleEscClose);
    document.addEventListener('click', handleOverlayClose);

    return () => {
      document.removeEventListener('keyup', handleEscClose);
      document.removeEventListener('click', handleOverlayClose);
    };
  }, [])


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
          handleLearnList={handleLearnList}
          compareFreq={compareFreq}
          translFreqs={translFreqs}
          setCharsFreq={setCharsFreq}
          wordFrequency={wordFreq}
          frIsLoading={frIsLoading}
          frNoData={frNoData}
          randomWords={randomWords}
          getFreqCat={getFreqCat}
          searchWords={searchWords}
          wordsAreLoading={wordsAreLoading}
          enDicLangs={enDicLangs}
          randomlangListActive={randomlangListActive}
          openLangListWords={openLangListWords}
          quizActive={quizActive}
          setQuizActive={startQuiz}
          closeQuiz={closeQuiz}
          quizQuestions={quizQuestions}
          filters={filters}
        />

        <Footer />

      </div>
    </div>
  )
}

export default App;
