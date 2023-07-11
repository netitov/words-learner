import React from 'react';

function Quiz(props) {

  const options = ['идти', 'смотреть', 'бежать', 'ползти'];

  const donePart = Math.round(7/10 * 100) + '%';

  return (
    <div className={`quiz${props.quizActive ? ' quiz_active' : ''}`}>
      <div className='quiz__container'>
        {/* progress */}

        <div className="quiz__progress">
          <div className="quiz__progress-done" style={{width: donePart}}></div>
          <span>{donePart}</span>
        </div>

        {/* word for translation */}
        <div className='quiz__quest'>
          <h3>walk</h3>
        </div>


        {/* options */}
        <div className='quiz__options-box'>
          {options.map((i) => (
            <button className='quiz__option' type='button' key={i}>{i}</button>
          ))}
        </div>

        {/* Btn next */}
        <button type='button' className='quiz__btn-next'>Next</button>
      </div>
      <button className="quiz__close-btn btn-cross" type="button" onClick={props.closeQuiz}>
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <line x1="0" x2="100" y1="0" y2="100" />
            <line x1="0" x2="100" y1="100" y2="0" />
          </svg>
        </button>
    </div>
  )
}

export default Quiz;
