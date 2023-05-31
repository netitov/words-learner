import React from 'react';
import { VscCheck } from 'react-icons/vsc';

function Languages(props) {



  return (
    <div className={`languages${props.isActive ? ' languages_active' : ''}`}>
      <input className='languages__search' type='text' placeholder='Search language'></input>
      <ul className='languages__list'>
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

    </div>
  )
}

export default Languages;
