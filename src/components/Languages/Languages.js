import React, { useState, useEffect } from 'react';
import { VscCheck } from 'react-icons/vsc';

function Languages(props) {

  return (
    <div className={`languages-wrapper${props.isActive ? ' languages-wrapper_active' : ''}`}>
      <div className={`languages${props.isActive ? ' languages_active' : ''}`}>
        <input
          className='languages__search'
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
                className={`languages__item ${props.activeLang === i.language ? ' languages__item_active' : ''}`}
                data-code={i.code}
                key={i.code}
                onClick={() => props.selectLang(i.language)}
              >
                <VscCheck />
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

      </div>

    </div>
  )
}

export default Languages;
