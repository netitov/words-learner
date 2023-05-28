import React, { useState } from 'react';
import { charsLimit, tooltipOption } from '../../utils/constants';
import { BsBookmarks } from 'react-icons/bs';
import Tooltip from '@mui/material/Tooltip';

function Translate() {

  const [chars, setChars] = useState('');

  function handleTranslate(e) {
    setChars(e.target.value);
  }

  function handleClear() {
    setChars('');
  }

  return (
    <div className='translator-wrapper'>
      <div className='translator'>

        <div className='translator__box'>
          <button className='translator__lang translator__lang_input'>English</button>
          <div className='translator__container translator__container_input'>
            <textarea
              className='translator__text'
              placeholder='Start typing'
              onChange={handleTranslate}
              value={chars}
            >
            </textarea>
            <span>{chars.length} / {charsLimit}</span>
            <Tooltip title='delete the text' componentsProps={{ tooltip: { sx: tooltipOption, } }}>
              <button className='btn-cross translator__btn' type='button' onClick={handleClear}>
                <svg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'>
                  <line x1='0' x2='100' y1='0' y2='100' />
                  <line x1='0' x2='100' y1='100' y2='0' />
                </svg>
              </button>
            </Tooltip>
          </div>

          <div className={`error${chars.length > charsLimit ? ' error_active' : ''}`}>
            <p>Sorry, only up to {charsLimit} characters</p>
          </div>
        </div>

        <Tooltip title='swap out the languages' componentsProps={{ tooltip: { sx: tooltipOption, } }}>
          <button className='translator__swap-btn' type='button' onClick={handleClear}>
            <svg id='_Слой_1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 288.33 145.4'>
              <defs></defs>
              <rect className='cls-1' y='33.28' width='263.84' height='4.08'/>
              <polygon className='cls-1' points='288.33 35.31 257.75 52.96 227.17 70.62 227.17 35.31 227.17 0 257.75 17.65 288.33 35.31'/>
              <rect className='cls-1' x='24.48' y='108.06' width='263.84' height='4.08'/>
              <polygon className='cls-1' points='0 110.09 30.58 127.75 61.16 145.4 61.16 110.09 61.16 74.78 30.58 92.44 0 110.09'/>
            </svg>
          </button>
        </Tooltip>

        <div className='translator__box'>
          <button className='translator__lang'>Russian</button>
          <div className='translator__container translator__container_output'>
            <div className='translator__text'>Translation will be here</div>
            <div></div>
            <Tooltip title='add to the learning list' componentsProps={{ tooltip: { sx: tooltipOption, } }}>
              <button className='translator__btn' type='button' onClick={handleClear}>
                <BsBookmarks size='20' color='#757575'/>
              </button>
            </Tooltip>

          </div>
        </div>

      </div>
    </div>
  )
}

export default Translate;
