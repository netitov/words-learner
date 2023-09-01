import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { charsLimit, tooltipOption, errorMessages } from '../../utils/constants';
import { AiOutlineQuestionCircle } from 'react-icons/ai';
import Tooltip from '@mui/material/Tooltip';
import Spinner from '../Spinner/Spinner';
import Languages from '../Languages/Languages';
import Dictionary from '../Dictionary/Dictionary';
import ColumnChart from '../ColumnChart/ColumnChart';
import HorizontalChart from '../HorizontalChart/HorizontalChart';
import { MdTranslate } from 'react-icons/md';
import { RiArrowLeftRightFill } from 'react-icons/ri';

import { translate, checkFrequency } from '../../utils/api';
import { getFreqCat } from '../../utils/getFreqCat';
import { useDispatch, useSelector } from 'react-redux';
import { selectInputLang } from '../../store/inputLang';
import { selectOutputLang } from '../../store/outputLang';
import useWordSave from '../../hooks/useWordSave';
import Bookmark from '../Bookmark/Bookmark';
import Snackbar from '../Snackbar/Snackbar';
import { showError } from '../../store/error';

function Translate(props) {

  const [activeBtn, setActiveBtn] = useState({ lang: '', type: '' });
  const [animation, setAnimation] = useState(false);
  const [langListActive, setLangListActive] = useState({ type: '', value: false });
  const [chars, setChars] = useState('');
  const [translation, setTranslation] = useState([]);
  const [savedTranslation, setSavedTranslation] = useState([]);
  const [savedTranslationSyn, setSavedTranslationSyn] = useState([]);
  const [otherTransl, setOtherTransl] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [frequency, setFrequency] = useState({ word: '', fr: 0, text: '', filmPer: 0 });
  const [translFreqs, setTranslFreqs] = useState([]);
  const [translatorHeight, setTranslatorHeight] = useState(600);
  const [translationResponse, setTranslationResponse] = useState([]);

  const pathRef = useRef();
  const compRef = useRef();
  const dispatch = useDispatch();

  const { handleWordList, closeSnackbar, checkList, isChecked, setIsChecked, snackbarActive, updateWordData } = useWordSave();

  const currentInputLang = useSelector((state) => state.inputLang);
  const currentOutputLang = useSelector((state) => state.outputLang);
  const languages = useSelector((state) => state.langList);
  const dictionLangs = useSelector((state) => state.dictionLangs);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const userWords = useSelector((state) => state.userWords);

  //open/close language list on btn click
  function toggleLangList(e) {
    const type = e.target.dataset.type;
    setActiveBtn({ lang: e.target.textContent, type });
    if (type === langListActive.type) {
      setLangListActive({ type: '', value: false });

    }
    else {
      setLangListActive({ type: type, value: true });
      //setRandomlangListActive({ value: false })
    }
  }

  function closeLangList() {
    if (!props.account) {
      //scroll back to comp beginning ('cause page can be scrolled while langage select)
      compRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      //scroll to the page top in account (because account element takes all page height)
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
    //close lang list
    setLangListActive({ value: false });
    //get back normal height to parent element
    handleTranslatorHeight(0);
  }

  //check translations in user word list
  function findSavedWords(translatedWords, savedWords) {
    const foundTranslations = [];
    const userLang = JSON.parse(localStorage.getItem('userLang'));
    const isDifferentLang = userLang?.lang !== currentInputLang.lang;

    //check translated word in user word list
    translatedWords.forEach((translatedWord) => {
      translatedWord.tr?.forEach((word) => {
        if (isDifferentLang) {
          if (savedWords.find(sw => sw.word === chars && sw.translation === word.text)) {
            foundTranslations.push(word.text);
          }
        } else {
          if (savedWords.find(sw => sw.word === word.text)) {
            foundTranslations.push(word.text);
            // /props.userWords.some(i => i.word === props.translation && i.translation === word);
          }
        }

        //check synonum of translated word in user word list
        word?.syn?.forEach((synonym) => {
          if (isDifferentLang) {
            if (savedWords.find(sw => sw.word === chars && sw.translation === synonym.text)) {
              foundTranslations.push(synonym.text);
            }
          } else {
            if (savedWords.find(sw => sw.word === synonym.text)) {
              foundTranslations.push(synonym.text);
            }
          }
        });
      });
    });

    return foundTranslations;
  }

  //check translations in user word list
  function findSavedSyns(translatedWords, savedWords, translation) {
    const foundTranslations = [];
    const userLang = JSON.parse(localStorage.getItem('userLang'));
    const isDifferentLang = userLang?.lang !== currentInputLang.lang;

    //check translated word (synonyms) in user word list
    translatedWords.forEach((translatedWord) => {
      translatedWord.tr?.forEach((word) => {

        word?.mean?.forEach((synonym) => {
          if (isDifferentLang) {
            if (savedWords.find(sw => sw.word === synonym.text)) {
              foundTranslations.push(synonym.text);
            }
          } else if (savedWords.find(sw => sw.word === translation && sw.translation === synonym.text)) {
            foundTranslations.push(synonym.text);
          }

        });
      });
    });

    return foundTranslations;
  }

  //display in dictionary which word is saved
  function updateDictionaryState(wordsArr, translation) {
    //words for column Translation
    const savedWords = wordsArr.length > 0 ? findSavedWords(wordsArr, userWords) : [];
    setSavedTranslation(savedWords);
    //words for column Synonyms
    const savedWordsSyn = wordsArr.length > 0 ? findSavedSyns(wordsArr, userWords, translation) : [];
    setSavedTranslationSyn(savedWordsSyn);
  }

  //translate text
  async function getTranslation(text) {
    //get translation
    const langs = currentInputLang.code + '-' + currentOutputLang.code;
    const inDictionary = dictionLangs.some((i) => i.languages === langs);
    const response = await translate({ langs, text, inDictionary });
    setIsLoading(false);

    if (response.error) {
      dispatch(showError(errorMessages.general));
    } else {
      //use translation
      setTranslationResponse(response);
      const translation = response.text === undefined ? response[0].tr[0].text : response.text[0];
      const otherTranslations = (response.text === undefined && response.length > 0) ? response : [];
      setTranslation(translation);
      setOtherTransl(otherTranslations);
      setTranslFreqs([]);

      //check saved words if user logged in to display them in dictionary
      if (isLoggedIn) {
        updateDictionaryState(response, translation);

        //check if word in user word list: to display bookmark in translator
        checkList(translation, text);
      }

      //get frequency if english is selected
      if (chars.split(' ').length === 1) {
        if (currentInputLang.lang === 'English') {
          getFrequency(chars);
        } else if (currentOutputLang.lang === 'English') {
          getFrequency(translation);
        } else setFrequency({ word: '', fr: 0, text: '' });
      }
    }
  }

  function swapLangs() {
    //setActiveLangInput(activeLangOutput);
    //setActiveLangOutput(activeLangInput);
    dispatch(selectInputLang(currentOutputLang));
    dispatch(selectOutputLang(currentInputLang));
    setChars(translation);
    setTranslation(chars);
  }

  //translate on word click
  function addTranslate(text, swap) {
    setChars(text);
    setTranslation('');
    if (swap) {
      dispatch(selectInputLang(currentOutputLang));
      dispatch(selectOutputLang(currentInputLang));
    }
  }

  function droppSearch() {
    setChars('');
    //setSnackbarActive(false);
    closeSnackbar();
  }

  //get translated word frequency
  async function getFrequency(word) {
    const response = await checkFrequency(word);

    if (response.length > 0) {
      const obj = response[0];
      const frequencyNumber = obj.fr;
      //for feat translate
      setFrequency({ word, fr: frequencyNumber, text: getFreqCat(frequencyNumber), filmPer: obj.filmPer });
    } else {
      setFrequency({ word: '', fr: 0, text: '', filmPer: 0 });
    }
  }

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

   //expand translation container for fitting languages box
   function handleTranslatorHeight(height) {
    if(height > 0) {
      setTranslatorHeight(height + 50);
    } else {
      setTranslatorHeight(600);
    }
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
      setSavedTranslation([]);
      setSavedTranslationSyn([]);
      setTranslationResponse([]);
      //setSnackbarActive();
      closeSnackbar();
      setIsChecked(false);
    }
  }, [chars, currentInputLang, currentOutputLang]);

  //animation
  useEffect(() => {
    function runAnimation() {
      const elementPos = pathRef.current.getBoundingClientRect().top;
      const elementHeight = pathRef.current.offsetHeight;
      const windowHeight = window.innerHeight;

      if (elementPos < windowHeight - (elementHeight * 0.4)) {
        setAnimation(true);
      } /* else {
        setAnimation(false);
      } */
    }

    window.addEventListener('scroll', runAnimation);
    return () => window.removeEventListener('scroll', runAnimation);
  }, []);

  //update dictionary state if userWords updated
  useEffect(() => {
    if (isLoggedIn && translationResponse.length > 0) {
      updateDictionaryState(translationResponse, translation);
    }
  }, [userWords])


  return (
    <div className='translator-wrapper' id='translator' style={{ minHeight: translatorHeight + 'px' }} ref={compRef}>
      <h2 className='translator-wrapper__heading heading2'>Translate and compare</h2>

      <div className={`translator${animation ? ' translator_active' : ''}`} ref={pathRef}>

        {/* input box */}
        <div className='translator__box translator__box_input'>
          <button
            className='translator__lang translator__lang_input'
            onClick={toggleLangList}
            data-type='input'
          >
            {/* {props.activeLangInput.lang} */}
            {currentInputLang.lang}
          </button>
          <div className='translator__container translator__container_input'>
            <textarea
              className={`translator__text${chars.length > 0 ? '' : ' translator__text_inactive'}`}
              placeholder='Start typing'
              onChange={e => setChars(e.target.value)}
              value={chars}
              maxLength='100'
            >
            </textarea>

            <div className='translator__secondary-container'>
              <div
                className={`translator__freq-box${frequency.text.length > 0
                  && currentInputLang.lang === 'English' ? ' translator__freq-box_active' : ''}`
                }
              >
                <ColumnChart
                  value={frequency.fr}
                  columnChartColor={props.columnChartColor}
                  columnChartStroke={props.columnChartStroke}
                />
                <span>{frequency.text} frequency</span>
                <Tooltip
                  componentsProps={{ tooltip: { sx: tooltipOption, } }}
                  title={
                    <p>Word frequency measure on the basis of American subtitles (51 million words in total).&nbsp;
                      <a
                        href='https://www.ugent.be/pp/experimentele-psychologie/en/research/documents/subtlexus/overview.htm'
                        target='_blank'
                        rel='noreferrer'
                        className='translator__tlt-link'
                      >Learn more</a>
                    </p>
                  }
                >
                  <button className='translator__tlt-btn'>
                    <AiOutlineQuestionCircle size='15' /* color='#757575' */ />
                  </button>

                </Tooltip>
              </div>
              <span>{chars.length} / {charsLimit}</span>
            </div>

            <Tooltip title='delete text' componentsProps={{ tooltip: { sx: tooltipOption, } }}>
              <button className='btn-cross translator__btn' type='button' onClick={droppSearch}>
                <svg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'>
                  <line x1='0' x2='100' y1='0' y2='100' />
                  <line x1='0' x2='100' y1='100' y2='0' />
                </svg>
              </button>
            </Tooltip>

            <Tooltip title='swap languages' componentsProps={{ tooltip: { sx: tooltipOption, } }}>
              <button className='translator__swap-btn-mob' type='button' onClick={swapLangs}>
                <RiArrowLeftRightFill />
              </button>
            </Tooltip>
          </div>

          <div className={`error${chars.length > charsLimit ? ' error_active' : ''}`}>
            <p>Sorry, only up to {charsLimit} characters</p>
          </div>


        </div>

        {/* swap btn */}
        <Tooltip title='swap languages' componentsProps={{ tooltip: { sx: tooltipOption, } }}>
          <button className='translator__swap-btn' type='button' onClick={swapLangs}>
            <svg id='_Слой_1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 288.33 145.4'>
              <defs></defs>
              <rect className='cls-1' y='33.28' width='263.84' height='4.08'/>
              <polygon className='cls-1' points='288.33 35.31 257.75 52.96 227.17 70.62 227.17 35.31 227.17 0 257.75 17.65 288.33 35.31'/>
              <rect className='cls-1' x='24.48' y='108.06' width='263.84' height='4.08'/>
              <polygon className='cls-1' points='0 110.09 30.58 127.75 61.16 145.4 61.16 110.09 61.16 74.78 30.58 92.44 0 110.09'/>
            </svg>
          </button>
        </Tooltip>

        {/* output box */}
        <div className='translator__box translator__box_output'>
          <button
            className={`translator__lang`}
            onClick={toggleLangList}
            data-type='output'
          >
            {/* {props.activeLangOutput.lang} */}
            {currentOutputLang.lang}
          </button>
          <div className='translator__container translator__container_output'>
            <p className={`translator__text${chars.length > 0 ? '' : ' translator__text_inactive'}`}>
              {chars.length > 0 ? translation : 'Translation will be here'}
            </p>

            <div className='translator__secondary-container'>
              <div
                className={`translator__freq-box${frequency.text.length > 0
                  && currentOutputLang.lang === 'English' ? ' translator__freq-box_active' : ''}`
                }
              >
                <ColumnChart
                  value={frequency.fr}
                  columnChartColor={props.columnChartColor}
                  columnChartStroke={props.columnChartStroke}
                />
                <span>{frequency.text} frequency</span>
                <Tooltip
                  componentsProps={{ tooltip: { sx: tooltipOption, } }}
                  title={
                    <p>Word frequency measure on the basis of American subtitles (51 million words in total).&nbsp;
                      <a
                        href='https://www.ugent.be/pp/experimentele-psychologie/en/research/documents/subtlexus/overview.htm'
                        target='_blank'
                        rel='noreferrer'
                        className='translator__tlt-link'
                      >Learn more</a>
                    </p>
                  }
                >
                  <button className='translator__tlt-btn'>
                    <AiOutlineQuestionCircle size='15'/*  color='#757575' */ />
                  </button>
                </Tooltip>
              </div>
            </div>

            <Bookmark
              toggleBookmark={() => handleWordList(chars, translation)}
              isChecked={isChecked}
              title={!isChecked ? 'add to the learning list' : 'remove from the learning list'}
              propClass='translator__btn'
              width='18px'
              height='18px'
            />
            <Spinner
              isLoading={isLoading}
            />
            {/* message for user on word save if user is not logged in */}
            {!isLoggedIn &&
              <Snackbar
                snackbarActive={snackbarActive}
                elClass='translator__snack'
                closeSnack={closeSnackbar}
                transformPos='_left'
              >
                <p className='translator__snack-text'>
                  <Link to='/signup'>Sign up</Link> / <Link to='/login'>Log in</Link>
                  &nbsp;to create your own word list and much more
                </p>
              </Snackbar>
            }

          </div>

        </div>
        {/* <AnimatePresence> */}
          {langListActive.value &&
            <Languages
              languages={languages}
              isActive={langListActive}
              activeBtn={activeBtn}
              closeLangList={closeLangList}
              account={props.account}
              onHeightChange={handleTranslatorHeight}
            />
          }
        {/* </AnimatePresence> */}

        <Dictionary
          otherTransl={otherTransl}
          addTranslate={addTranslate}
          handleLearnList={(word, wordTransl, isSaved) => handleWordList(word, wordTransl, isSaved, true)} //true: call from dictionary
          compareFreq={compareFreq}
          outputLang={currentOutputLang.lang}
          inputLang={currentInputLang.lang}
          chars={chars}
          userWords={userWords}
          savedTranslation={savedTranslation}
          savedTranslationSyn={savedTranslationSyn}
          handleUpdateList={(word, translation) => updateWordData(word, translation)}
          isChecked={isChecked}
          translation={translation}
        />

        <HorizontalChart
          translFreqs={translFreqs}
          chartColor={props.chartColor}
          chartFontColor={props.chartFontColor}
        />
      </div>

      <MdTranslate className='translator__bck-svg bck-svg'/>
    </div>
  )
}

export default Translate;
