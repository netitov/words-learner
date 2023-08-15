import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import Spinner from '../Spinner/Spinner';
import Languages from '../Languages/Languages';
import { useSelector } from 'react-redux';
import { MdOutlineQuiz } from 'react-icons/md';
import { BsBookmarks } from 'react-icons/bs';
import { CiFilter } from 'react-icons/ci';
import useWordSave from '../../hooks/useWordSave';
import Bookmark from '../Bookmark/Bookmark';

function WordList() {

  const [langListActive, setLangListActive] = useState({ type: '', value: false });
  const [activeLangBtn, setActiveLangBtn] = useState({ lang: '', type: '' });
  const [words, setWords] = useState([]);

  const pathRef = useRef();

  const currentInputLang = useSelector((state) => state.inputLang);
  const currentOutputLang = useSelector((state) => state.outputLang);
  const languages = useSelector((state) => state.enDictionLangs);
  const userWords = useSelector((state) => state.userWords);

  const initRows = 10;
  const rowsStep = 10;
  const rowHeight = 46;

  const { removeWord } = useWordSave();


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

  //set initial rows
  useEffect(() => {
    setWords(userWords.slice(0, initRows));
  }, [userWords])

  //lazy loading of table rows
  useEffect(() => {
    function displayMoreRows() {
      const elementPos = pathRef.current.getBoundingClientRect().top;
      const elementHeight = pathRef.current.offsetHeight;
      const windowHeight = window.innerHeight;
      //run function before last element scrolled and if not all rows displayed
      if ((elementPos < windowHeight - elementHeight + rowHeight) && (words.length < userWords.length)) {
        setWords(prevWords => {
          const newVisibleRowCount = Math.min((prevWords.length + rowsStep), userWords.length);
          return userWords.slice(0, newVisibleRowCount);
        });
      }
    }

    window.addEventListener('scroll', displayMoreRows);
    return () => window.removeEventListener('scroll', displayMoreRows);
  }, [userWords, words]);


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

      <table className='wordlist__table wordlist-table' ref={pathRef}>
        <thead>
          <tr>
            <th className='wordlist-table__th wordlist-table__th_checkbox'>
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
          {words.map((i, index) => (
            <tr
              key={i.word}
              className='wordlist-table__row'
            >
              <td>
                <Bookmark
                  toggleBookmark={() => removeWord(i.word)}
                  isChecked={true}
                  title='remove from the learning list'
                  propClass='wordlist-table__checkbox'
                  width='18px'
                  height='18px'
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
    </div>

  )
}

export default WordList;
