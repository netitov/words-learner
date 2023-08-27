import { useState, useEffect } from 'react';

function useHandleQuiz() {
  const [quizActive, setQuizActive] = useState(false);

  function startQuiz() {
    setQuizActive(true);
  }

  function closeQuiz() {
    setQuizActive(false);
  }

  useEffect(() => {
    function handleEscClose(e) {
      if (e.key === 'Escape') {
        closeQuiz();
      }
    }

    function handleOverlayClose(e) {
      if (e.target.classList.contains('quiz')) {
        closeQuiz();
      }
    }

    document.addEventListener('keyup', handleEscClose);
    document.addEventListener('click', handleOverlayClose);

    return () => {
      document.removeEventListener('keyup', handleEscClose);
      document.removeEventListener('click', handleOverlayClose);
    };
  }, []);

  return { quizActive, startQuiz, closeQuiz };
}

export default useHandleQuiz;
