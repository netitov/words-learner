import React, { useState, useEffect, useRef } from 'react';
import { VscCheck } from 'react-icons/vsc';
import { useDispatch, useSelector } from 'react-redux';
import { selectInputLang } from '../../store/inputLang';
import { selectOutputLang } from '../../store/outputLang';

function Languages(props) {

  const activityClass = props.isActive.value ? ' languages_active' : '';
  const typeClass = props.activeBtn.type === 'input' || props.activeBtn.type === 'random' ? ' languages_input' : '';

  const currentInputLang = useSelector((state) => state.inputLang);
  const currentOutputLang = useSelector((state) => state.outputLang);

  const [input, setInput] = useState('');
  const [languages, setLanguages] = useState([]);

  const langRef = useRef(null);
  //const [inputLang, setInputLang] = useState({ lang: 'English', code: 'en' });
  //const [outputLang, setOutputLang] = useState({ lang: '', code: '' });

  const dispatch = useDispatch();

  useEffect(() => {
    setLanguages(props.languages);
  }, [props.languages]);


  function changeLang(lang, type, code) {

    //if lang list is opened from block random words
    if (props.source === 'random') {

      if (currentOutputLang.code === 'en') {
        //setInputLang({ lang, code });
        dispatch(selectInputLang({ lang, code }));
      } else {
        //setOutputLang({ lang, code });
        dispatch(selectOutputLang({ lang, code }));
        console.log({ lang, code })
      }

    } else if (type === 'input') {
      //setInputLang({ lang, code });
      dispatch(selectInputLang({ lang, code }));
    } else {
      //setOutputLang({ lang, code });
      dispatch(selectOutputLang({ lang, code }));
    }

    props.closeLangList();

    //update/save user language on local storage
    if (code !== 'en') {
      localStorage.setItem('userLang', JSON.stringify({ lang, code }));
    }
  }

  //search language through translator
  function searchLang(data) {
    //const languages = randomlangListActive.value ? enDicLangsInit : availLang;
    setInput(data);
    const text = data.toLowerCase();
    const filteredArr = props.languages.filter((i) => i.language.toLowerCase().includes(text));
    setLanguages(filteredArr);

    /* if (randomlangListActive.value) {
      setEnDicLangs(filteredArr);
    } else {
      setFilteredLang(filteredArr);
    } */
  }

  //drop search if window is closed or new one is opened
  useEffect(() => {
    setInput('');
    setLanguages(props.languages);
  },[props.isActive])

  //close popup available languages list on esc and overlay click
  useEffect(() => {
    function handleEscClose(e) {
      if (e.key === 'Escape') {
        props.closeLangList();
      }
    }
    function handleOverlayClose (e) {
      if (props.isActive.value && !langRef.current.contains(e.target) &&
      !e.target.classList.contains('translator__lang') && !e.target.classList.contains('wtable__th_btn')) {
        //if lang list open from random words than close it, ohterwise close list in translation
        //randomlangListActive.value ? setRandomlangListActive({ value: false }) : setLangListActive({ value: false });
        props.closeLangList();
      }
    }
    document.addEventListener('keyup', handleEscClose);
    document.addEventListener('click', handleOverlayClose);

    return () => {
      document.removeEventListener('keyup', handleEscClose);
      document.removeEventListener('click', handleOverlayClose);
    };
  }, [props.isActive])

  //update parent height for fitting child - only in account
  useEffect(() => {
    if (langRef.current && props.account) {
      if (props.isActive.value) {
        const height = langRef.current.getBoundingClientRect().height;
        props.onHeightChange(height);
      } else {
        props.onHeightChange(0);
      }
    }
  }, [props.isActive]);



  return (
    <div className={`languages-wrapper${props.isActive.value ? ' languages-wrapper_active' : ''}`} ref={langRef}>
      <div className={`languages${activityClass}${typeClass}`}>
        <input
          className={`languages__search${props.activeBtn.type === 'input' || props.activeBtn.type === 'random' ? ' languages__search_input' : ''}`}
          type='text'
          placeholder='Search language'
          //onChange={(e) => props.searchLang(e.target.value)}
          //value={props.inputText}

          value={input}
          onChange={(e) => searchLang(e.target.value)}
        >
        </input>
        <ul className={`languages__list${input.length > 0 ? ' languages__list_filtered' : ''}`}>
          {languages.map((i) => {
            return (
              <li
                className={`languages__item ${props.activeBtn.lang === i.language ? ' languages__item_active' : ''}`}
                data-code={i.code}
                key={i.code}
                /* onClick={() => props.selectLang(i.language, props.activeBtn.type, i.code)} */
                onClick={() => changeLang(i.language, props.activeBtn.type, i.code)}
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
          className={`languages__not-found${languages.length < 1 ? ' languages__not-found_active' : ''}`}
        >
          No data &#128532;
        </span>

        <span className={`languages__comment${props.source === 'random' && input === '' ? ' languages__comment_active' : ''}`}>
          At the moment, this feature only supports the following languages.
        </span>

      </div>

    </div>
  )
}

export default Languages;
