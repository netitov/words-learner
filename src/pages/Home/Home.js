import React, { useState, useEffect, useRef } from 'react';
import Translate from '../../components/Translator/Translator';
import Frequency from '../../components/Frequency/Frequency';
import RandomWords from '../../components/RandomWords/RandomWords';
import Promo from '../../components/Promo/Promo';
import Quiz from '../../components/Quiz/Quiz';
import About from '../../components/About/About';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { useSelector, useDispatch } from 'react-redux';
import useHandleQuiz from '../../hooks/useHandleQuiz';
import { AnimatePresence } from 'framer-motion';

function Home() {

  const [animation, setAnimation] = useState(false);
  //const [quizActive, setQuizActive] = useState(false);

  const pathRef = useRef();
  const { closeQuiz, quizActive, startQuiz } = useHandleQuiz();

  const randomWords = useSelector((state) => state.randomWords.data);

  function handleLearnList() {

  }

  //run animation
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

  return (
    <>
      <Header />

      <main className='main'>

        <Promo />

        <About />

        <Translate
          handleLearnList={handleLearnList}
          chartColor='#fcc5546e'
          chartFontColor='#757575'
          columnChartColor='#127386'
          columnChartStroke='#757575'
        />

        <Frequency
          handleLearnList={handleLearnList}
        />

        <RandomWords
          handleLearnList={handleLearnList}
        />

        <div className='main__quiz' id='quiz'>
          <h2 className='main__heading heading2'>Learn and test yourself</h2>
          <div className={`main__quiz-container${animation ? ' main__quiz-container_active' : ''}`} ref={pathRef}>
            <div className='main__block-disciption'>
              <p>Take the tests and check your progress.</p>
              <p>Use filters above to update the word list</p>
            </div>
            <button className='main__quiz-btn' type='button' onClick={startQuiz}>Start test</button>
          </div>
          {/* quiz modal */}
          <AnimatePresence>
            {quizActive &&
              <Quiz
                quizActive={quizActive}
                closeQuiz={closeQuiz}
                quizWords={randomWords}
              />
            }
          </AnimatePresence>
        </div>

      </main>

      <Footer />
    </>
  )
}

export default Home;
