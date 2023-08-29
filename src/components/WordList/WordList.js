import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Spinner from '../Spinner/Spinner';
import Languages from '../Languages/Languages';
import { useSelector, useDispatch } from 'react-redux';
import { MdOutlineQuiz } from 'react-icons/md';
import { BsBookmarks } from 'react-icons/bs';
import { CiFilter } from 'react-icons/ci';
import useWordSave from '../../hooks/useWordSave';
import Bookmark from '../Bookmark/Bookmark';
import CollectionSummary from '../CollectionSummary/CollectionSummary';
import useHandleQuiz from '../../hooks/useHandleQuiz';
import { AnimatePresence } from 'framer-motion';
import Quiz from '../Quiz/Quiz';
import { addResultToListAPI } from '../../utils/api';
import { updateWordState } from '../../store/userWords';
import { setFilters } from '../../store/filters';

function WordList() {

  const [langListActive, setLangListActive] = useState({ type: '', value: false });
  const [activeLangBtn, setActiveLangBtn] = useState({ lang: '', type: '' });
  const [words, setWords] = useState([]);
  const [quizWords, setQuizWords] = useState([]);
  const [initWords, setInitWords] = useState([]);
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [filteredWords, setFilteredWords] = useState([]);

  const pathRef = useRef();
  const path = useLocation().pathname;
  const currentCollectionId = path.substring(path.lastIndexOf('/') + 1);

  const currentInputLang = useSelector((state) => state.inputLang);
  const currentOutputLang = useSelector((state) => state.outputLang);
  const languages = useSelector((state) => state.enDictionLangs);
  const userWords = useSelector((state) => state.userWords);

  const initRows = 10;
  const rowsStep = 10;
  const rowHeight = 46;
  const learnThreshold = 3; //minimal numbler of taken tests

  const { removeWord } = useWordSave();
  const { closeQuiz, quizActive, startQuiz } = useHandleQuiz();

  const dispatch = useDispatch();


  function toggleLangList(e) {
    const lang = currentInputLang.code === 'en' ? currentOutputLang.lang : currentInputLang.lang;
    setActiveLangBtn({ lang, type: 'random' });
    if (langListActive.type === 'random') {
      setLangListActive({ type: '', value: false });
    }
    else {
      setLangListActive({ type: 'random', value: true });
    }
  }

  function closeLangList() {
    setLangListActive({ value: false });
  }

  function shuffleArray(array) {
    return array.slice().sort(() => Math.random() - 0.5);
  }

  //continue quiz: update questions
  function updateQuiz() {
    const randomArr = shuffleArray(initWords);
    const randomArrSlice = randomArr.slice(0, initRows);
    setQuizWords(randomArrSlice);
    return randomArrSlice;
  }

  //save quiz results by word to db
  async function saveQuizResult(resultObj) {
    const token = localStorage.getItem('token');
    const updatedWord = await addResultToListAPI(resultObj, token);
    console.log(updatedWord)
    console.log(resultObj)
    if (!updatedWord.error) {
      //add result to storage
      const storage = JSON.parse(sessionStorage.getItem('userWords'));
      const updatedStorage = storage.map(wordObj => {
          return wordObj._id === updatedWord._id ? updatedWord : wordObj;
      });
      sessionStorage.setItem('userWords', JSON.stringify(updatedStorage));

      //update redux state
      dispatch(updateWordState([updatedWord]));
      return updatedWord;
    } else {
      return updatedWord;
    }
  }

  //get words learning progress
  /* const getProgress = useMemo(() => {
    return (arr) => {
      const correctAnswers = arr.filter(i => i.value).length;
      const totalQuestions = arr.length;
      return totalQuestions === 0 ? 0 : Math.round((correctAnswers / totalQuestions) * 100);
    };
  }, [words]); */

  //get words learning progress
  function getProgress(arr) {
    const correctAnswers = arr.filter(i => i.value).length;
    //3 is a goal. If value more than 100% - use 100%
    return correctAnswers === 0 ? 0 : Math.min(Math.round((correctAnswers / learnThreshold) * 100), 100);
  }

  //show words for which the quiz was passed less than 3 times
  function filterLearnedWords(arr) {
    return arr.filter((i) => {
      const learnedWords = i.results.filter(el => el.value === true).length;

      return learnedWords < learnThreshold;
    });
  }

  //show/hide fitered words
  function toggFilterdWords() {
    if (isFilterActive) {
      //dropp filtered words if filter removed
      setFilteredWords([]);
      setIsFilterActive(false);
    } else {
      setFilteredWords(filterLearnedWords(words));
      setIsFilterActive(true);
    }
  }

  //set initial rows and words for quiz
  useEffect(() => {
    //display all saved words of location is words
    if (currentCollectionId === 'words') {
      const wordsSlice = userWords.slice(0, initRows);
      setWords(wordsSlice);//words for table
      setInitWords(userWords);
      setQuizWords(shuffleArray(wordsSlice));//shuffle words for quiz
    } else {
      //display words from specific collection
      const wordsFromCurrentCollection = userWords.filter((i) => i.source.some(el => el.collectionId === currentCollectionId));
      const wordsSlice = wordsFromCurrentCollection.slice(0, initRows);
      setWords(wordsSlice);
      setInitWords(wordsFromCurrentCollection);
      setQuizWords(shuffleArray(wordsSlice));
    }

  }, [userWords, path])

  //lazy loading of table rows
  useEffect(() => {
    if (initWords.length > initRows) {
      function displayMoreRows() {
        const elementPos = pathRef.current.getBoundingClientRect().top;
        const elementHeight = pathRef.current.offsetHeight;
        const windowHeight = window.innerHeight;
        //run function before last element scrolled and if not all rows displayed
        if ((elementPos < windowHeight - elementHeight + rowHeight) && (words.length < userWords.length)) {
          setWords(prevWords => {
            const newVisibleRowCount = Math.min((prevWords.length + rowsStep), userWords.length);
            return initWords.slice(0, newVisibleRowCount);
          });
        }
      }
      window.addEventListener('scroll', displayMoreRows);
      return () => window.removeEventListener('scroll', displayMoreRows);
    }
  }, [userWords, initWords]);


  return (
    <div className='wordlist'>

      {/* collection dashboard */}
      <CollectionSummary
        totalWords={words.length}
      />

      {/* buttons filters and routes */}
      <div className='wordlist__btn-container'>
        <Link to='/account/translator' className='wordlist__btn'>
          <svg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'>
            <line x1='0' x2='100' y1='0' y2='100' />
            <line x1='0' x2='100' y1='100' y2='0' />
          </svg>
          Add a word
        </Link>
        <Link className='wordlist__btn' to='/account/collections'>
          <BsBookmarks className='wordlist__btn-icon'/>
          Go to Collections
        </Link>
        {words.length > 0 &&
          <button className='wordlist__btn' type='button' onClick={startQuiz}>
            <MdOutlineQuiz className='wordlist__btn-icon'/>
            Take a quiz
          </button>
        }
        {/* show btn if there are learned words */}
        {filterLearnedWords(words).length !== words.length &&
          <button type='button' className={`wordlist__btn${isFilterActive ? ' wordlist__btn_active' : ''}`} onClick={toggFilterdWords}>
            <CiFilter className='wordlist__btn-icon' />
            {isFilterActive ? 'Show learned words' : 'Hide learned words'}
          </button>
        }

      </div>

      {/* words table */}
      <table className='wordlist__table wordlist-table' ref={pathRef}>
        <thead>
          <tr>
            <th className='wordlist-table__th wordlist-table__th_checkbox'>
              {/* list of available languages */}
              {/* <Languages
                languages={languages}
                isActive={langListActive}
                activeBtn={activeLangBtn}
                commentActive={true}
                closeLangList={closeLangList}
              /> */}
            </th>
            <th>word</th>
            <th className='wordlist-table__th wordlist-table__th_btn'
              onClick={toggleLangList}
            >
              translation ({currentInputLang.code === 'en' ? currentOutputLang.code : currentInputLang.code})
            </th>
            <th>collection</th>
            <th>progress</th>

          </tr>

        </thead>

        <tbody>
          {/* use filtered words if filter active otherwise - all words */}
          {(isFilterActive ? filteredWords : words).map((i, index) => (
            <tr
              key={i.word}
              className='wordlist-table__row'
            >
              <td>
                <Bookmark
                  toggleBookmark={() => removeWord(i.word)}
                  isChecked={true}
                  title='remove from the learning list'
                  propClass='wordlist-table__checkbox'
                  width='18px'
                  height='18px'
                />
              </td>
              <td className='wordlist-table__td wordlist-table__td_emph'>{i.word}</td>
              <td>{i.translation}</td>
              <td className='wordlist-table__td'>
                {/* active reference to other collection if current location is not equal*/}
                {i.source?.length === 0 ? (
                  <span className='wordlist-table__tag'>All words</span>
                ) : (
                  i.source?.map((s) => (
                    s.collectionId === currentCollectionId ? (
                      <span className='wordlist-table__tag' key={s.collectionId}>
                        {!s.collectionName ? 'All words' : s.collectionName}
                      </span>
                    ) : (
                      <Link className='wordlist-table__tag' to={`/account/words/collections/${s.collectionId}`} key={s.collectionId}>
                        {!s.collectionName ? 'All words' : s.collectionName}
                      </Link>
                    )
                  ))
                )}
              </td>
              <td>
                <div className='wordlist-table__progress'>
                  <div className='wordlist-table__progress-chart'>
                    <div className='wordlist-table__progress-done' style={{ width: `${getProgress(i.results)}%` }}></div>
                  </div>
                  <span>{getProgress(i.results)}%</span>
                </div>
              </td>

            </tr>
          ))}
        </tbody>
      </table>

      {/* quiz */}
      <AnimatePresence>
        {quizActive &&
          <Quiz
            quizActive={quizActive}
            closeQuiz={closeQuiz}
            quizWords={quizWords}
            account={true}
            updateQuiz={updateQuiz}
            saveQuizResult={saveQuizResult}
          />
        }
      </AnimatePresence>

    </div>

  )
}

export default WordList;
