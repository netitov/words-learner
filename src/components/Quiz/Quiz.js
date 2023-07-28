import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IoCheckmarkCircleOutline } from 'react-icons/io5';
import { IoCloseCircleOutline } from 'react-icons/io5';
import Spinner from '../Spinner/Spinner';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);


function Quiz(props) {

  const [questions, setQuestions] = useState([]);
  const [activeQuestion, setActiveQuestion] = useState({ question: '', options: [] });
  const [passedQuests, setPassedQuests] = useState([]);
  const [progress, setProgress] = useState({ percent: '0%', quest: 1 });
  const [result, setResult] = useState({ quests: 0, correctAnsw: 0 });
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);


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
    if (passedQuests.some(el => el.question === i.question)) {
      const completedPart = Math.round(passedQuests.length/questions.length * 100);

      const currPosition = props.quizQuestions.findIndex((i) => i.question === activeQuestion.question);
      const quest = ((currPosition + 1) > (questions.length - 1)) ? { question: '' } : props.quizQuestions[currPosition + 1];
      setActiveQuestion(quest);

      //progress line
      const nextQuestPos = props.quizQuestions.findIndex((i) => i.question === quest.question);
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
    if (!passedQuests.some((question) => question.question === quest.question)) {
      const obj = {
        ...quest,
        passed: true,
        correct: quest.correctAnswer === answ,
        answer: answ
      };
      setPassedQuests(prevItems => [...prevItems, obj]);
    }
  }

  //apply styles for options buttons (answers)
  function handleAnswerBtn(word) {
    const answeredQuestion = passedQuests.find((question) => question.question === activeQuestion.question);

    if (!answeredQuestion) {
      return '';
    } else if (answeredQuestion.answer === word) {
      if (answeredQuestion.correctAnswer === word) {
        return ' quiz__option_correct quiz__option_passed';
      } else {
        return ' quiz__option_incorrect quiz__option_passed';
      }
    } else if (activeQuestion.correctAnswer === word) {
      return ' quiz__option_correct quiz__option_passed';
    }
    return ' quiz__option_passed';
  }

  function droppData() {
    setActiveQuestion({ question: '', options: [] });
    setPassedQuests([]);
    setProgress({ percent: '0%', quest: 1 });
    setResult({ quests: 0, correctAnsw: 0 });
    setComment('');
    setActiveQuestion(props.quizQuestions[0]);
  }

  function handleClose() {
    props.closeQuiz();
    droppData();
  }

  // use redux fo filters?
  async function updateWords() {
    //search new words for quiz
    console.log('func start')
    setIsLoading(true);
    await props.searchWords();

    //dropp data and go to the first quest
    droppData();
    setIsLoading(false);

    console.log('finish QUIZ')
  }

  //update quiz qestions if props changed
  useEffect(() => {
    if (props.quizQuestions.length > 0) {
      setQuestions(props.quizQuestions);
      setActiveQuestion(props.quizQuestions[0]);
    }
  }, [props.quizQuestions])

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
    <div className={`quiz${props.quizActive ? ' quiz_active' : ''}`}>
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
            <button className='quiz__btn quiz__btn-result' type='button' onClick={droppData}>Start over</button>
            <button className='quiz__btn quiz__btn-result' type='button' onClick={updateWords}>Update words</button>
            <button className='quiz__btn quiz__btn-result' type='button' onClick={handleClose}>Close</button>
          </div>

          <p className='quiz__login'>
            <Link to='#'>Sign up</Link> / <Link to='#'>Sign in</Link>
            &nbsp;to save your results, create your own word list and much more
          </p>
        </div>

        {/* quiz */}
        {questions.map((i) => (

          <div
            className={`quiz__quest-box${i.question === activeQuestion.question ? ' quiz__quest-box_active' : ''}`}
            key={i.question}
          >
            {/* question box */}
            <div className='quiz__quest'>
              <h3>{i.question}</h3>
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
              className={`quiz__btn quiz__btn-next${passedQuests.some(el => el.question === i.question) ? ' quiz__btn-next_active' : ''}`}
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

        <button className='quiz__close-btn btn-cross' type='button' onClick={handleClose}>
          <svg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'>
            <line x1='0' x2='100' y1='0' y2='100' />
            <line x1='0' x2='100' y1='100' y2='0' />
          </svg>
        </button>

      </div>

    </div>
  )
}

export default Quiz;
