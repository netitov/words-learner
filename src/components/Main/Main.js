import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import Translate from '../Translator/Translator';
import Frequency from '../Frequency/Frequency';
import RandomWords from '../RandomWords/RandomWords';
import Promo from '../Promo/Promo';
import Quiz from '../Quiz/Quiz';
import About from '../About/About';
import { getRandomWords } from '../../utils/api';
import { getFreqCat } from '../../utils/getFreqCat';

function Main() {
  const [animation, setAnimation] = useState(false);
  const [quizActive, setQuizActive] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [randomWords, setRandomWords] = useState([]);
  const [filters, setFilters] = useState({ frSt: 3, frEn: 5.5 });

  const currentInputLang = useSelector((state) => state.inputLang);
  const currentOutputLang = useSelector((state) => state.outputLang);

  const pathRef = useRef();

  // request random words from DB
  async function requestRandomWords(filtersData) {
    const response = await getRandomWords(filtersData);
    const { lang } = filtersData;
    const newObj = response.map((i) => {
      const frCat = getFreqCat(i.fr);
      return { ...i, frCat, lang };
    });
    sessionStorage.setItem('randomWords', JSON.stringify(newObj));
    setRandomWords(newObj);
    setIsLoading(false);
  }

  // create questions and answers for quiz (from random words)
  function createQuizQuestions() {
    const wordStorage = JSON.parse(sessionStorage.getItem('randomWords'));
    const allWords = [];
    const quizArr = [];
    const mainWords = [];

    wordStorage.forEach((i) => {
      const obj = { word: i.translation, translation: i.word, pos: i.pos.toLowerCase() };
      allWords.push(obj);
      mainWords.push(obj);

      i.otherTransl.forEach((o) => {
        o.tr.forEach((el) => {
          if (!allWords.some((word) => word.word === el.text)) {
            const trObj = { word: el.text, pos: el.pos, syn: i.translation };
            allWords.push(trObj);
          }
        });
      });
    });

    mainWords.forEach((i) => {
      const wordObj = {
        question: i.translation,
        correctAnswer: i.word,
        pos: i.pos,
        options: [],
      };

      const filteredWords = allWords.filter((el) => {
        return (
          el.word !== wordObj.correctAnswer && el.syn !== wordObj.correctAnswer
        ); /* && el.pos === obj.pos */
      });

      while (wordObj.options.length < 3) {
        const randomIndex = Math.floor(Math.random() * filteredWords.length);

        const newOpt = filteredWords[randomIndex].word;

        if (!wordObj.options.some((opt) => opt === newOpt)) {
          wordObj.options.push(newOpt);
        }
      }

      quizArr.push(wordObj);

      const randomIndexinArr = Math.floor(Math.random() * 4);
      wordObj.options.splice(randomIndexinArr, 0, wordObj.correctAnswer);
    });

    return quizArr;
  }

  function updateQuizQuestions() {
    const quizArr = createQuizQuestions();
    setQuizQuestions(quizArr);
    sessionStorage.setItem('quizQuestions', JSON.stringify(quizArr));
  }

  // handle search random words
  async function searchWords(filts) {
    // check of words are not already loaded

    if (!isLoading) {
      const currLang = JSON.parse(localStorage.getItem('userLang'));

      const newFilters = {
        ...(filts === undefined ? filters : filts),
        lang: currLang.code,
      };

      setIsLoading(true);
      setFilters(newFilters);
      await requestRandomWords(newFilters);

      updateQuizQuestions();
    }
  }

  function handleLearnList() {}

  async function fetchRandomWords(newFilters) {
    await requestRandomWords(newFilters);
    updateQuizQuestions();
  }

  // get init random words + quiz words/ update list of words if languages are changed
  useEffect(() => {
    const currLang = JSON.parse(localStorage.getItem('userLang'));
    if (currLang) {
      const wordStorage = JSON.parse(sessionStorage.getItem('randomWords'));
      const quizStorage = JSON.parse(sessionStorage.getItem('quizQuestions'));

      // if language were not changed, use list of words from session storage
      if (wordStorage?.some((i) => i.lang === currLang.code)) {
        setRandomWords(wordStorage);
        setQuizQuestions(quizStorage);
      } else {
        setIsLoading(true);

        // use current filters, but update the language
        const newFilters = {
          ...filters,
          lang: currLang.code,
        };

        /* let timer;

        function delayedRequestRandomWords() {
          timer = setTimeout(async () => {
            await requestRandomWords(newFilters);
            updateQuizQuestions();
          }, 2000);
        }
        delayedRequestRandomWords(); */

        fetchRandomWords(newFilters);

        setFilters(newFilters);

        // return () => clearTimeout(timer);
      }
    }
  }, [currentInputLang, currentOutputLang]);

  // QUIZ

  // open quiz
  function startQuiz() {
    setQuizActive(true);
  }

  function closeQuiz() {
    setQuizActive(false);
  }

  // close quiz on esc and overlay click
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
  }, []);

  // run animation
  useEffect(() => {
    function runAnimation() {
      const elementPos = pathRef.current.getBoundingClientRect().top;
      const elementHeight = pathRef.current.offsetHeight;
      const windowHeight = window.innerHeight;

      if (elementPos < windowHeight - elementHeight * 0.4) {
        setAnimation(true);
      } /* else {
        setAnimation(false);
      } */
    }

    window.addEventListener('scroll', runAnimation);
    return () => window.removeEventListener('scroll', runAnimation);
  }, []);

  return (
    <main className='main'>
      <Promo />

      <About />

      <Translate handleLearnList={handleLearnList} />

      <Frequency handleLearnList={handleLearnList} />

      <RandomWords
        randomWords={randomWords}
        searchWords={searchWords}
        handleLearnList={handleLearnList}
        isLoading={isLoading}
      />

      <div className='main__quiz' id='quiz'>
        <h2 className='main__heading heading2'>Learn and test yourself</h2>
        <div
          className={`main__quiz-container${animation ? ' main__quiz-container_active' : ''}`}
          ref={pathRef}
        >
          <div className='main__block-disciption'>
            <p>Take the tests and check your progress.</p>
            <p>Use filters above to update the word list</p>
          </div>
          <button className='main__quiz-btn' type='button' onClick={startQuiz}>
            Start test
          </button>
        </div>
        <Quiz
          quizActive={quizActive}
          closeQuiz={closeQuiz}
          quizQuestions={quizQuestions}
          searchWords={searchWords}
        />
      </div>
    </main>
  );
}

export default Main;
