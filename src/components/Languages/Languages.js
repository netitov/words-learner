import React, { useState, useEffect } from 'react';
import { VscCheck } from 'react-icons/vsc';

function Languages(props) {

  const activityClass = props.isActive.value ? ' languages_active' : '';
  const typeClass = props.activeBtn.type === 'input' || props.activeBtn.type === 'random' ? ' languages_input' : '';

  return (
    <div className={`languages-wrapper${props.isActive.value ? ' languages-wrapper_active' : ''}`}>
      <div className={`languages${activityClass}${typeClass}`}>
        <input
          className={`languages__search${props.activeBtn.type === 'input' || props.activeBtn.type === 'random' ? ' languages__search_input' : ''}`}
          type='text'
          placeholder='Search language'
          onChange={(e) => props.searchLang(e.target.value)}
          value={props.inputText}
        >
        </input>
        <ul className={`languages__list${props.inputText.length > 0 ? ' languages__list_filtered' : ''}`}>
          {props.languages.map((i) => {
            return (
              <li
                className={`languages__item ${props.activeBtn.lang === i.language ? ' languages__item_active' : ''}`}
                data-code={i.code}
                key={i.code}
                onClick={() => props.selectLang(i.language, props.activeBtn.type, i.code)}
              >
                <div className='languages__mark'>
                  {props.activeBtn.lang === i.language ? <VscCheck /> : ''}
                </div>

                <span>{i.language}</span>
              </li>
            )
          })}
        </ul>

        <span
          className={`languages__not-found${props.languages.length < 1 ? ' languages__not-found_active' : ''}`}
        >
          No data &#128532;
        </span>

        <span className={`languages__comment${props.commentActive && props.inputText === '' ? ' languages__comment_active' : ''}`}>
          At the moment, this feature only supports the following languages.
        </span>

      </div>

    </div>
  )
}

export default Languages;
