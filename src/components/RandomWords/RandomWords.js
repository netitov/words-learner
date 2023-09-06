import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import { GiSettingsKnobs } from 'react-icons/gi';
import { useSelector } from 'react-redux';
import { filterBtns } from '../../utils/constants';
import Spinner from '../Spinner/Spinner';
import RefTooltip from '../RefTooltip/RefTooltip';
import useRandomWordsFetch from '../../hooks/useRandomWordsFetch';
import useWordSave from '../../hooks/useWordSave';
import Bookmark from '../Bookmark/Bookmark';
import Snackbar from '../Snackbar/Snackbar';

function RandomWords() {
  const initPos = ['Noun', 'Adjective', 'Verb'];

  const marks = [
    {
      value: 2,
      label: 'low',
    },
    {
      value: 4,
      label: 'high',
    },
    {
      value: 6,
      label: 'very high',
    },
  ];

  const [pos, setPos] = useState([]);
  const [words, setWords] = useState([]);
  const [frValue, setFrValue] = useState([3, 5.5]);
  const [perValue, setPerValue] = useState([0, 100]);
  const [activeBtn, setActiveBtn] = useState('');
  const [filtersActive, setFiltersActive] = useState(false);
  const [animationFilter, setAnimationFilter] = useState(false);
  const [langListActive, setLangListActive] = useState({ type: '', value: false });
  // const [activeLangBtn, setActiveLangBtn] = useState({ lang: '', type: '' });

  const { requestRandomWords } = useRandomWordsFetch();

  const filterRef = useRef();

  const currentInputLang = useSelector((state) => state.inputLang);
  const currentOutputLang = useSelector((state) => state.outputLang);
  const randomWords = useSelector((state) => state.randomWords.data);
  const randomWordsInLoading = useSelector((state) => state.randomWords.isLoading);
  const filters = useSelector((state) => state.filters);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const userWords = useSelector((state) => state.userWords);

  const { handleWordList, closeSnackbar, snackbarActive } = useWordSave();

  // handle event changing part of speech select
  function handleChangePos(event) {
    const {
      target: { value },
    } = event;
    setPos(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  }

  function handleChangeSLider(e, newValue) {
    if (e.target.name === 'frequency') {
      setFrValue(newValue);
    } else {
      setPerValue(newValue);
    }
  }

  // execute search
  async function searchWords(filts) {
    // check of words are not already loaded
    if (!randomWordsInLoading) {
      const newFilters = { ...(filts === undefined ? filters : filts) };
      await requestRandomWords(newFilters);
    }
  }

  // handle filter words on tag btn click
  function handleBtnFilter(e) {
    let updatedFilters = {};

    if (e.target.textContent === 'highest frequency') {
      updatedFilters = {
        frSt: 5,
        frEn: 8,
      };
    }

    if (e.target.textContent === 'common verbs') {
      updatedFilters = {
        frSt: 4,
        frEn: 8,
        pos: ['Verb'],
      };
    }

    if (e.target.textContent === 'common nouns') {
      updatedFilters = {
        frSt: 4,
        frEn: 8,
        pos: ['Noun'],
      };
    }

    if (e.target.textContent === 'in every movie') {
      updatedFilters = {
        filmPerSt: 70,
        filmPerEn: 100,
      };
    }

    if (e.target.textContent === 'average frequency') {
      updatedFilters = {
        frSt: 2,
        frEn: 3,
      };
    }

    if (e.target.textContent === 'low frequency') {
      updatedFilters = {
        frSt: 1,
        frEn: 3,
      };
    }

    setActiveBtn(e.target.textContent);

    // dropp other filters
    setFrValue([0, 7]);
    setPerValue([0, 100]);
    setPos([]);

    closeSnackbar();

    searchWords(updatedFilters);
  }

  // handle filter words on search btn click
  function handleSearchClick() {
    const newfilters = {
      frSt: frValue[0],
      frEn: frValue[1] === 7 ? 8 : frValue[1],
      pos,
      filmPerSt: perValue[0],
      filmPerEn: perValue[1],
    };
    setActiveBtn('');
    searchWords(newfilters);
    closeSnackbar();
  }

  function handleFilters() {
    setFiltersActive(!filtersActive);
  }

  function runAnimationFilter() {
    const elementPos = filterRef.current.getBoundingClientRect().top;
    const elementHeight = filterRef.current.offsetHeight;
    const windowHeight = window.innerHeight;

    if (elementPos < windowHeight - elementHeight * 0.4) {
      setAnimationFilter(true);
    } /* else {
      setAnimationFilter(false);
    } */
  }

  function toggleLangList() {
    // const lang = currentInputLang.code === 'en' ? currentOutputLang.lang : currentInputLang.lang;
    // setActiveLangBtn({ lang, type: 'random' });
    if (langListActive.type === 'random') {
      setLangListActive({ type: '', value: false });
    } else {
      setLangListActive({ type: 'random', value: true });
    }
  }

  /* function closeLangList() {
    setLangListActive({ value: false });
  } */

  useEffect(() => {
    setWords(randomWords);
  }, [randomWords]);

  // run animation
  useEffect(() => {
    window.addEventListener('scroll', runAnimationFilter);

    return () => {
      window.removeEventListener('scroll', runAnimationFilter);
    };
  }, []);

  return (
    <div className='words' id='random'>
      <h2 className='words__heading heading2'>Find words</h2>

      <div className={`words__dis-cont${animationFilter ? ' words__dis-cont_active' : ''}`}>
        <p>Some random words you can start learning.</p>
        <p>Use filters to create a customized list of words</p>
      </div>

      <div className='words__container'>
        {/* btn filters */}
        <div
          className={`words__btn-box${animationFilter ? ' words__btn-box_active' : ''}`}
          ref={filterRef}
        >
          {filterBtns.map((i) => (
            <button
              type='button'
              className={`words__filter-btn${activeBtn === i ? ' words__filter-btn_active' : ''}`}
              onClick={handleBtnFilter}
              key={i}
            >
              {i}
            </button>
          ))}
        </div>

        {/* additional filters */}
        <div className={`words__filter-box${animationFilter ? ' words__filter-box_active' : ''}`}>
          {/* container with table filters */}
          <div className='words__filter-cont'>
            <div className='words__btn-cont'>
              <button
                className={`words__search-btn${
                  randomWordsInLoading ? ' words__search-btn_inactive' : ''
                }`}
                type='button'
                onClick={handleSearchClick}
              >
                Search / update
              </button>
              <button className='words__filter-icon' type='button' onClick={handleFilters}>
                <GiSettingsKnobs />
              </button>
            </div>

            <div className={`words__filters${filtersActive ? ' words__filters_active' : ''}`}>
              <FormControl className='words__select'>
                <InputLabel id='demo-multiple-chip-label'>Part of speech</InputLabel>
                <Select
                  labelId='demo-multiple-chip-label'
                  id='demo-multiple-chip'
                  multiple
                  value={pos}
                  onChange={handleChangePos}
                  input={<OutlinedInput id='select-multiple-chip' label='Part of speech' />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                >
                  {initPos.map((i) => (
                    <MenuItem key={i} value={i}>
                      {i}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <div className='words__slider-wrapper'>
                <div className='words__heading-box'>
                  <h3 className='words__slider-heading'>Frequency</h3>
                  <RefTooltip class='words__fr-tlt' color='#757575'>
                    <p>
                      Word frequency measure on the basis of American subtitle in Zipf format (scale
                      1-7).&nbsp;
                      <a
                        href='https://www.ugent.be/pp/experimentele-psychologie/en/research/documents/subtlexus/overview.htm'
                        target='_blank'
                        rel='noreferrer'
                        className='frequency__tlt-link'
                      >
                        Learn more
                      </a>
                    </p>
                  </RefTooltip>
                </div>

                <Slider
                  value={frValue}
                  name='frequency'
                  onChange={handleChangeSLider}
                  valueLabelDisplay='on'
                  className='words__slider'
                  step={0.5}
                  min={1.5}
                  max={7}
                  marks={marks}
                />
              </div>

              <div className='words__slider-wrapper'>
                <div className='words__heading-box'>
                  <h3 className='words__slider-heading'>Film percent</h3>
                  <RefTooltip class='words__fr-tlt' color='#757575'>
                    <p>Indicates in how many percent of films the word appears</p>
                  </RefTooltip>
                </div>

                <Slider
                  value={perValue}
                  onChange={handleChangeSLider}
                  valueLabelDisplay='on'
                  className='words__slider'
                  step={10}
                  min={0}
                  max={100}
                />
              </div>
            </div>
          </div>
        </div>

        {/* table of words */}
        <div
          className={`words__table-wrapper${animationFilter ? ' words__table-wrapper_active' : ''}`}
        >
          <table className='wtable'>
            <thead>
              <tr>
                <th className='wtable__th wtable__th_checkbox'>
                  {/* <Tooltip title='add all words to the learning list' componentsProps={{ tooltip: { sx: tooltipOption, } }}>
                    <Checkbox
                      className='wtable__checkbox'
                      icon={<BookmarkBorderIcon sx={{ fontSize: '1.4rem', color: '#7575759c' }} />}
                      checkedIcon={<BookmarkIcon sx={{ fontSize: '1.4rem'}} />}
                      onChange={handleAllCheck}
                    />
                  </Tooltip> */}
                  {/* list of available languages */}
                  {/* <Languages
                    languages={languages}
                    isActive={langListActive}
                    //selectLang={props.selectLang}
                    activeBtn={activeLangBtn}
                    //searchLang={props.searchLang}
                    //inputText={props.inputText}
                    commentActive={true}
                    closeLangList={closeLangList}
                  /> */}
                </th>
                <th>word</th>
                <th
                  className='wtable__th wtable__th_btn' /* onClick={() => props.openLangListWords('random')} */
                  onClick={toggleLangList}
                >
                  translation (
                  {currentInputLang.code === 'en' ? currentOutputLang.code : currentInputLang.code})
                </th>
                <th>frequency</th>
                {/* <th>film %</th> */}
              </tr>
            </thead>

            <tbody>
              {words.map((i) => (
                <tr key={i.word}>
                  <td>
                    <Bookmark
                      toggleBookmark={() =>
                        handleWordList(
                          i.word,
                          i.translation,
                          userWords.some((u) => u.word === i.word),
                          true,
                        )
                      }
                      isChecked={userWords.some((u) => u.word === i.word)}
                      title={
                        !userWords.some((u) => u.word === i.word)
                          ? 'add to the learning list'
                          : 'remove from the learning list'
                      }
                      propClass='words__save-btn'
                      width='17px'
                      height='17px'
                    />
                  </td>
                  <td className='wtable__td wtable__td_emph'>{i.word}</td>
                  <td>{i.translation}</td>
                  <td className='wtable__td'>
                    <span className={`wtable__fr-btn${i.fr >= 4 ? ' wtable__fr-btn_high' : ''}`}>
                      {i.frCat}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div
            className={`words__table-overlay${
              randomWordsInLoading ? ' words__table-overlay_active' : ''
            }`}
          >
            <Spinner isLoading={randomWordsInLoading} />
          </div>

          <span
            className={`words__not-found${
              !randomWordsInLoading && words.length === 0 ? ' words__not-found_active' : ''
            }`}
          >
            Sorry, data not found. &#128532; Please try different filters <br />
          </span>
        </div>
      </div>

      {/* show message if user is not logged in and tries to save word */}
      {!isLoggedIn && (
        <Snackbar
          snackbarActive={snackbarActive}
          elClass='words__snack translator__snack'
          closeSnack={closeSnackbar}
          transformPos='_left'
        >
          <p className='translator__snack-text'>
            <Link to='/signup'>Sign up</Link> / <Link to='/login'>Log in</Link>
            &nbsp;to create your own word list and much more
          </p>
        </Snackbar>
      )}
    </div>
  );
}

export default RandomWords;
