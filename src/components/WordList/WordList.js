import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Spinner from '../Spinner/Spinner';
import Languages from '../Languages/Languages';

import Checkbox from '@mui/material/Checkbox';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { useSelector } from 'react-redux';

import { MdOutlineQuiz } from 'react-icons/md';
import { BsBookmarks } from 'react-icons/bs';
import { CiFilter } from 'react-icons/ci';

import { getWordList, addToList } from '../../utils/api';

function WordList() {

  const [langListActive, setLangListActive] = useState({ type: '', value: false });
  const [activeLangBtn, setActiveLangBtn] = useState({ lang: '', type: '' });
  const [words, setWords] = useState([]);

  const currentInputLang = useSelector((state) => state.inputLang);
  const currentOutputLang = useSelector((state) => state.outputLang);
  const languages = useSelector((state) => state.enDictionLangs);

  ///const words = JSON.parse(sessionStorage.getItem('randomWords'));

  function toggleLangList(e) {
    const lang = currentInputLang.code === 'en' ? currentOutputLang.lang : currentInputLang.lang;
    setActiveLangBtn({ lang, type: 'random' });
    if (langListActive.type === 'random') {
      setLangListActive({ type: '', value: false });
    }
    else {
      setLangListActive({ type: 'random', value: true });
    }
  }

  function closeLangList() {
    setLangListActive({ value: false });
  }

  function handleCheck(i) {
    const updatedData = words.map((obj) => {
      if (obj._id === i._id) {
        return {
          ...obj,
          checked: !obj.checked,
        };
      }
      return obj;
    });

  }

  async function addRandomWordsToList(words) {
    const token = localStorage.getItem('token');
    const newWords = words.map((i) => {
      const newObj = {
        word: i.word,
        translation: i.translation,
        translationLang: i.lang,
        source: ['random']
      };
      return newObj;
    })
    const response = await addToList(newWords, token);
    return response;
  }

  //get user word list
  async function fetchWords() {
    const token = localStorage.getItem('token');
    const wordList = await getWordList(token);
    if (wordList.err) {
      console.log(wordList.err);
      return [];
    } else {
      return wordList;
    }
  }

  //set user word list
  async function initializeWords() {
    const storage = JSON.parse(sessionStorage.getItem('userWords'));
    if (!storage) {
      //if words not in session storage - fetch them and add to session storage
      const wordList = await fetchWords();
      if (wordList.length > 0) {
        setWords(wordList);
        sessionStorage.setItem('userWords', JSON.stringify(wordList));
      } else {
        //if user doesn't have saved words yet - use random words for exapmle
        const words = JSON.parse(sessionStorage.getItem('randomWords')).slice(0, 5);
        setWords(words);
        sessionStorage.setItem('userWords', JSON.stringify(words));
        //add random words to user list
        await addRandomWordsToList(words);
      }
    } else {
      setWords(storage);
    }
  }


  //set user word list
  useEffect(() => {
    initializeWords();
  }, [])


  return (
    <div className='wordlist'>

      <div className='wordlist__btn-container'>
        <Link to='/account/translator' className='wordlist__btn'>
          <svg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'>
            <line x1='0' x2='100' y1='0' y2='100' />
            <line x1='0' x2='100' y1='100' y2='0' />
          </svg>
          Add a word
        </Link>
        <Link className='wordlist__btn' to='#'>
          <BsBookmarks className='wordlist__btn-icon'/>
          Go to Collections
        </Link>
        <Link className='wordlist__btn' to='#'>
          <MdOutlineQuiz className='wordlist__btn-icon'/>
          Take a quiz
        </Link>
        <button type='button' className='wordlist__btn'>
          <CiFilter className='wordlist__btn-icon' />
          Hide learned words
        </button>
      </div>

      <table className='wordlist__table wordlist-table'>
        <thead>
          <tr>
            <th className='wordlist-table__th wordlist-table__th_checkbox'>
              {/* <Tooltip title='add all words to the learning list' componentsProps={{ tooltip: { sx: tooltipOption, } }}>
                <Checkbox
                  className='wordlist__checkbox'
                  icon={<BookmarkBorderIcon sx={{ fontSize: '1.4rem', color: '#7575759c' }} />}
                  checkedIcon={<BookmarkIcon sx={{ fontSize: '1.4rem'}} />}
                />
              </Tooltip> */}

              {/* list of available languages */}
              <Languages
                languages={languages}
                isActive={langListActive}
                activeBtn={activeLangBtn}
                commentActive={true}
                closeLangList={closeLangList}
              />
            </th>
            <th>word</th>
            <th className='wordlist-table__th wordlist-table__th_btn' /* onClick={() => props.openLangListWords('random')} */
              onClick={toggleLangList}
            >
              translation ({currentInputLang.code === 'en' ? currentOutputLang.code : currentInputLang.code})

            </th>
            <th>source</th>
            <th>progress</th>

          </tr>

        </thead>

        <tbody>
          {words.map((i) => (
            <tr key={i.word}>
              <td>
                <Checkbox
                  className='wordlist-table__checkbox'
                  icon={<BookmarkBorderIcon sx={{ fontSize: '1.4rem', color: '#bebebe' }}/>}
                  checkedIcon={<BookmarkIcon sx={{ fontSize: '1.4rem' }}/>}
                  onChange={() => handleCheck(i)}
                  checked={true}
                  title='remove from the learning list'
                />
              </td>
              <td className='wordlist-table__td wordlist-table__td_emph'>{i.word}</td>
              <td>{i.translation}</td>
              <td className='wordlist-table__td'>
                <span className='wordlist-table__tag'>Some book</span>
              </td>
              <td>
                <div className='wordlist-table__progress'>
                  <div className='wordlist-table__progress-chart'>
                    <div className='wordlist-table__progress-done' style={{ width: '35%' }}></div>
                  </div>
                  <span>35%</span>
                </div>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
      <div className='wordlist__pgn-btn-box'>
        <button className='wordlist__pgn-btn wordlist__btn' type='button'>
          Show all words
        </button>
      </div>
    </div>

  )
}

export default WordList;
