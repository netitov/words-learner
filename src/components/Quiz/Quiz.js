import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { IoCheckmarkCircleOutline } from 'react-icons/io5';
import { IoCloseCircleOutline } from 'react-icons/io5';
import Spinner from '../Spinner/Spinner';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import useRandomWordsFetch from '../../hooks/useRandomWordsFetch';
import { getQuizDataDB } from '../../utils/api';
import { showError } from '../../store/error';
import { errorMessages } from '../../utils/constants';
import { motion } from 'framer-motion';

ChartJS.register(ArcElement, Tooltip, Legend);

function Quiz(props) {

  const [questions, setQuestions] = useState([]);
  const [activeQuestion, setActiveQuestion] = useState({ translation: '', options: [] });
  const [passedQuests, setPassedQuests] = useState([]);
  const [progress, setProgress] = useState({ percent: '0%', quest: 1 });
  const [result, setResult] = useState({ quests: 0, correctAnsw: 0 });
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const randomWords = useSelector((state) => state.randomWords.data);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  const { requestRandomWords } = useRandomWordsFetch();
  const dispatch = useDispatch();


  function handleComment(percent) {
    if (percent === 1) {
      return 'Perfect!';
    }
    if (percent >= 0.8) {
      return 'Great job!';
    }
    if (percent >= 0.6) {
      return 'Good job!';
    } else {
      return 'You can do better!';
    }

  }

  function setNextQuestion(i) {
    //run if answer is given
    if (passedQuests.some(el => el.translation === i.translation)) {
      const completedPart = Math.round(passedQuests.length/questions.length * 100);

      const currPosition = questions.findIndex((i) => i.translation === activeQuestion.translation);
      const quest = ((currPosition + 1) > (questions.length - 1)) ? { word: '' } : questions[currPosition + 1];
      setActiveQuestion(quest);

      //progress line
      const nextQuestPos = questions.findIndex((i) => i.translation === quest.translation);
      setProgress({ percent: completedPart + '%', quest: nextQuestPos + 1 });

      //quiz result
      if (completedPart === 100) {
        const correctAnswer = passedQuests.filter(i => i.correct).length;
        setResult({ quests: passedQuests.length, correctAnsw: correctAnswer });

        const newComment = handleComment(correctAnswer / passedQuests.length);
        setComment(newComment);
      }
    }
  }

  //chech answer
  function handleAnswer(quest, answ) {
    if (!passedQuests.some((question) => question.translation === quest.translation)) {
      const obj = {
        ...quest,
        passed: true,
        correct: quest.word === answ,
        answer: answ
      };
      setPassedQuests(prevItems => [...prevItems, obj]);
    }
  }

  //apply styles for options buttons (answers)
  function handleAnswerBtn(text) {
    const answeredQuestion = passedQuests.find((question) => question.translation === activeQuestion.translation);
    if (!answeredQuestion) {
      return '';
    } else if (answeredQuestion.answer === text) {
      if (answeredQuestion.word === text) {
        return ' quiz__option_correct quiz__option_passed';
      } else {
        return ' quiz__option_incorrect quiz__option_passed';
      }
    } else if (activeQuestion.word === text) {
      return ' quiz__option_correct quiz__option_passed';
    }
    return ' quiz__option_passed';
  }

  function droppData() {
    setActiveQuestion({ translation: '', options: [] });
    setPassedQuests([]);
    setProgress({ percent: '0%', quest: 1 });
    setResult({ quests: 0, correctAnsw: 0 });
    setComment('');
    //setActiveQuestion(questions[0]);
  }

  function startOver() {
    droppData();
    setActiveQuestion(questions[0]);
  }

  function handleClose() {
    props.closeQuiz();
    droppData();
  }

  //search new words
  async function updateWords() {
    setIsLoading(true);
    await requestRandomWords();
  }

  //create questions and answers for quiz (from random words)
  function createQuizQuestions() {
    const wordStorage = randomWords;
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

  async function setQuizQuestions(wordsArr) {
    setIsLoading(true);
    const quizData = await getQuizDataDB(wordsArr);

    //handle error
    if (quizData.error) {
      dispatch(showError(errorMessages.general));
    } else {
      setQuestions(quizData);
      setActiveQuestion(quizData[0]);
    }

    setIsLoading(false);
    //sessionStorage.setItem('quizQuestions', JSON.stringify(quizArr));
  }

  //get initial quiz questions and update when words props changed
  useEffect(() => {
    if (props.quizWords.length > 0) {
      //dropp data and go to the first quest
      droppData();
      setQuizQuestions(props.quizWords);
    }
  }, [props.quizWords])

  const data = {
    labels: ['correct answers', 'incorrect answers'],

    datasets: [
      {
        data: [result.correctAnsw, result.quests - result.correctAnsw],
        backgroundColor: [
          '#fcc554',
          '#f9dda4',
        ],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      }
    },
    elements: {
      arc: {
        borderWidth: 0
      }
    },
    rotation: -90,
    circumference: 180,
    cutout: '85%'
  }


  return (
    <motion.div
      /* className={`quiz${props.quizActive ? ' quiz_active' : ''}`} */
      className={`quiz quiz_active`}
      initial={{  opacity: 0 }}
      animate={{  opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className='quiz__container'>

        {/* progress */}
        <div className={`quiz__progress${progress.percent === '100%' ? ' quiz__progress_inactive' : ''}`}>
          <div className='quiz__progress-done' style={{width: progress.percent}}></div>
          <span>{progress.quest} / {questions.length}</span>
        </div>

        {/* result */}
        <div className={`quiz__result${progress.percent === '100%' ? ' quiz__result_active' : ''}`}>

          <div className='quiz__chart'>
            <Doughnut data={data} options={options}/>
            <span className='quiz__chart-result'>{result.correctAnsw / result.quests * 100}%</span>
          </div>

          <div className='quiz__comment-box'>
            <p className='quiz__progress-comment'>Your result: <span>{result.correctAnsw} / {result.quests}</span></p>
            <p className='quiz__progress-comment'>{comment}</p>
          </div>

          <div className='quiz__btn-box'>
            <button className='quiz__btn quiz__btn-result' type='button' onClick={startOver}>Start over</button>
            {/* if test is taken from user account shuffle saved words, otherwise update random words */}
            {props.account ? (
              <button className='quiz__btn quiz__btn-result' type='button' onClick={props.updateQuiz}>Continue</button>
              ) : (
              <button className='quiz__btn quiz__btn-result' type='button' onClick={updateWords}>Update words</button>
              )
            }
            <button className='quiz__btn quiz__btn-result' type='button' onClick={handleClose}>Close</button>
          </div>

          {!isLoggedIn &&
            <p className='quiz__login'>
              <Link to='#'>Sign up</Link> / <Link to='#'>Sign in</Link>
              &nbsp;to save your results, create your own word list and much more
            </p>
          }
        </div>

        {/* quiz */}
        {questions.map((i) => (

          <div
            className={`quiz__quest-box${i.translation === activeQuestion.translation ? ' quiz__quest-box_active' : ''}`}
            key={i.translation}
          >
            {/* question box */}
            <div className='quiz__quest'>
              <h3>{i.translation}</h3>
            </div>

            {/* box with answers */}
            <div className='quiz__options-box'>
              {i.options.map((word, index) => (
                <button
                  className={`quiz__option${handleAnswerBtn(word)}`}
                  type='button'
                  key={word}
                  onClick={() => handleAnswer(i, word)}
                >
                  <span>{word}</span>
                    {handleAnswerBtn(word).includes(' quiz__option_correct') ? <IoCheckmarkCircleOutline /> :
                      handleAnswerBtn(word).includes(' quiz__option_incorrect') ? <IoCloseCircleOutline /> : ''
                    }
                </button>
              ))}
            </div>

            {/* btn next */}
            <button
              type='button'
              className={`quiz__btn quiz__btn-next${passedQuests.some(el => el.translation === i.translation) ? ' quiz__btn-next_active' : ''}`}
              onClick={() => setNextQuestion(i)}
            >
              Next
            </button>
          </div>

        ))}

        {/* loading overlay */}
        <div
          className={`quiz__overlay${isLoading ? ' quiz__overlay_active' : ''}`}
        >
          <Spinner isLoading={isLoading}/>
        </div>

        {/* close btn */}
        <button className='quiz__close-btn btn-cross' type='button' onClick={handleClose}>
          <svg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'>
            <line x1='0' x2='100' y1='0' y2='100' />
            <line x1='0' x2='100' y1='100' y2='0' />
          </svg>
        </button>

      </div>

    </motion.div>
  )
}

export default Quiz;
