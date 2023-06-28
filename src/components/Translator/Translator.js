import React, { useState, useEffect } from 'react';
import { charsLimit, tooltipOption } from '../../utils/constants';
import { BsBookmarks } from 'react-icons/bs';
import { AiOutlineQuestionCircle } from 'react-icons/ai';
import Tooltip from '@mui/material/Tooltip';
import Spinner from '../Spinner/Spinner';
import Languages from '../Languages/Languages';
import Dictionary from '../Dictionary/Dictionary';
import ColumnChart from '../ColumnChart/ColumnChart';
import HorizontalChart from '../HorizontalChart/HorizontalChart';

function Translate(props) {

  const [activeBtn, setActiveBtn] = useState({
    lang: '', type: ''
  });

  function handleLangClick(e) {
    setActiveBtn({ lang: e.target.textContent, type: e.target.dataset.type });
    props.openLangList(e.target.dataset.type);
  }

  return (
    <div className='translator-wrapper' >
      <div className='translator'>

        <div className='translator__box translator__box_input'>
          <button
            className='translator__lang translator__lang_input'
            onClick={handleLangClick}
            data-type='input'
          >
            {props.activeLangInput.lang}
          </button>
          <div className='translator__container translator__container_input'>
            <textarea
              className={`translator__text${props.chars.length > 0 ? '' : ' translator__text_inactive'}`}
              placeholder='Start typing'
              onChange={e => props.setChars(e.target.value)}
              value={props.chars}
            >
            </textarea>

            <div className='translator__secondary-container'>
              <div
                className={`translator__freq-box${props.frequency.text.length > 0
                  && props.activeLangInput.lang === 'English' ? ' translator__freq-box_active' : ''}`
                }
              >
                <ColumnChart value={props.frequency.fr}/>
                <span>{props.frequency.text} frequency</span>
                <Tooltip
                  componentsProps={{ tooltip: { sx: tooltipOption, } }}
                  title={
                    <p>Word frequencies based on subtitles of British television programs.&nbsp;
                      <a
                        href='http://crr.ugent.be/papers/van_Heuven_et_al_SUBTLEX-UK.pdf'
                        target='_blank'
                        rel='noreferrer'
                        className='translator__tlt-link'
                      >Learn more</a>
                    </p>
                  }
                >
                  <button className='translator__tlt-btn'>
                    <AiOutlineQuestionCircle size='15' color='#757575' />
                  </button>

                </Tooltip>
              </div>
              <span>{props.chars.length} / {charsLimit}</span>
            </div>

            <Tooltip title='delete text' componentsProps={{ tooltip: { sx: tooltipOption, } }}>
              <button className='btn-cross translator__btn' type='button' onClick={props.handleClear}>
                <svg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'>
                  <line x1='0' x2='100' y1='0' y2='100' />
                  <line x1='0' x2='100' y1='100' y2='0' />
                </svg>
              </button>
            </Tooltip>
          </div>

          <div className={`error${props.chars.length > charsLimit ? ' error_active' : ''}`}>
            <p>Sorry, only up to {charsLimit} characters</p>
          </div>
        </div>

        <Tooltip title='swap languages' componentsProps={{ tooltip: { sx: tooltipOption, } }}>
          <button className='translator__swap-btn' type='button' onClick={props.swapLangs}>
            <svg id='_Слой_1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 288.33 145.4'>
              <defs></defs>
              <rect className='cls-1' y='33.28' width='263.84' height='4.08'/>
              <polygon className='cls-1' points='288.33 35.31 257.75 52.96 227.17 70.62 227.17 35.31 227.17 0 257.75 17.65 288.33 35.31'/>
              <rect className='cls-1' x='24.48' y='108.06' width='263.84' height='4.08'/>
              <polygon className='cls-1' points='0 110.09 30.58 127.75 61.16 145.4 61.16 110.09 61.16 74.78 30.58 92.44 0 110.09'/>
            </svg>
          </button>
        </Tooltip>

        <div className='translator__box translator__box_output'>
          <button
            className={`translator__lang`}
            onClick={handleLangClick}
            data-type='output'
          >
            {props.activeLangOutput.lang}
          </button>
          <div className='translator__container translator__container_output'>
            <p className={`translator__text${props.chars.length > 0 ? '' : ' translator__text_inactive'}`}>
              {props.chars.length > 0 ? props.translation : 'Translation will be here'}
            </p>

            <div className='translator__secondary-container'>
              <div
                className={`translator__freq-box${props.frequency.text.length > 0
                  && props.activeLangOutput.lang === 'English' ? ' translator__freq-box_active' : ''}`
                }
              >
                <ColumnChart value={props.frequency.fr}/>
                <span>{props.frequency.text} frequency</span>
                <Tooltip
                  componentsProps={{ tooltip: { sx: tooltipOption, } }}
                  title={
                    <p>Word frequencies based on subtitles of British television programs.&nbsp;
                      <a
                        href='http://crr.ugent.be/papers/van_Heuven_et_al_SUBTLEX-UK.pdf'
                        target='_blank'
                        rel='noreferrer'
                        className='translator__tlt-link'
                      >Learn more</a>
                    </p>
                  }
                >
                  <button className='translator__tlt-btn'>
                    <AiOutlineQuestionCircle size='15' color='#757575' />
                  </button>
                </Tooltip>
              </div>
            </div>

            <Tooltip title='add to the learning list' componentsProps={{ tooltip: { sx: tooltipOption, } }}>
              <button className='translator__btn' type='button' onClick={props.handleClear}>
                <BsBookmarks size='20' color='#757575'/>
              </button>
            </Tooltip>
            <Spinner
              isLoading={props.isLoading}
            />
          </div>
        </div>

        <Languages
          languages={props.languages}
          isActive={props.isActive}
          selectLang={props.selectLang}
          activeBtn={activeBtn}
          searchLang={props.searchLang}
          inputText={props.inputText}
        />

        <Dictionary
          otherTransl={props.otherTransl}
          addTranslate={props.addTranslate}
          addToList={props.addToList}
          compareFreq={props.compareFreq}
          outputLang={props.activeLangOutput.lang}
          inputLang={props.activeLangInput.lang}
        />

        <HorizontalChart
          translFreqs={props.translFreqs}
        />
      </div>
    </div>
  )
}

export default Translate;
