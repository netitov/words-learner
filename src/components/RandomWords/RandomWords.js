import React, { useEffect, useState, useRef } from 'react';
import Slider from '@mui/material/Slider';
import RefTooltip from '../RefTooltip/RefTooltip';
import Spinner from '../Spinner/Spinner';
import Languages from '../Languages/Languages';

import Checkbox from '@mui/material/Checkbox';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import { tooltipOption, filterBtns } from '../../utils/constants';
import { GiSettingsKnobs } from 'react-icons/gi';
import { useSelector } from 'react-redux';

function RandomWords(props) {

  const initPos = [
    'Noun',
    'Adjective',
    'Verb',
  ];

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
  const [activeLangBtn, setActiveLangBtn] = useState({ lang: '', type: '' });

  const filterRef = useRef();

  const currentInputLang = useSelector((state) => state.inputLang);
  const currentOutputLang = useSelector((state) => state.outputLang);
  const languages = useSelector((state) => state.enDictionLangs);


  //handle event changing part of speech select
  function handleChangePos(event) {
    const {
      target: { value },
    } = event;
    setPos(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  function handleChangeSLider(e, newValue) {
    if (e.target.name === 'frequency') {
      setFrValue(newValue);
    } else {
      setPerValue(newValue);
    }
  };

  //handle checkbox in header for manage all checkboxes in the table
  function handleAllCheck(e) {
    const currentState = e.target.checked;

    const updatedData = words.map((obj) => {
      return {
        ...obj,
        checked: currentState,
      };
    });

    setWords(updatedData);
    props.handleLearnList(updatedData);
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

    setWords(updatedData);
    props.handleLearnList(updatedData.find((el) => el._id === i._id ));
  }

  function handleBtnFilter(e) {

    let filters = {};

    if (e.target.textContent === 'highest frequency') {
      filters = {
        frSt: 5,
        frEn: 8,
      };
    };

    if (e.target.textContent === 'common verbs') {
      filters = {
        frSt: 4,
        frEn: 8,
        pos: ['Verb']
      };
    };

    if (e.target.textContent === 'common nouns') {
      filters = {
        frSt: 4,
        frEn: 8,
        pos: ['Noun']
      };
    };

    if (e.target.textContent === 'in every movie') {
      filters = {
        filmPerSt: 70,
        filmPerEn: 100
      };
    };

    if (e.target.textContent === 'average frequency') {
      filters = {
        frSt: 2,
        frEn: 3
      };
    };

    if (e.target.textContent === 'low frequency') {
      filters = {
        frSt: 1,
        frEn: 3
      };
    };

    setActiveBtn(e.target.textContent);

    //dropp other filters
    setFrValue([0, 7]);
    setPerValue([0, 100]);
    setPos([]);

    props.searchWords(filters);
  }

  function handleSearchClick() {
    const filters = {
      frSt: frValue[0],
      frEn: frValue[1] === 7 ? 8 : frValue[1],
      pos: pos,
      filmPerSt: perValue[0],
      filmPerEn: perValue[1]
    };
    setActiveBtn('');
    props.searchWords(filters);
  }

  function handleFilters() {
    setFiltersActive(!filtersActive);
  }

  function runAnimationFilter() {
    const elementPos = filterRef.current.getBoundingClientRect().top;
    const elementHeight = filterRef.current.offsetHeight;
    const windowHeight = window.innerHeight;

    if (elementPos < windowHeight - (elementHeight * 0.4)) {
      setAnimationFilter(true);
    } /* else {
      setAnimationFilter(false);
    } */
  }

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

  useEffect(() => {
    setWords(props.randomWords);
  }, [props.randomWords])

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
        <div className={`words__btn-box${animationFilter ? ' words__btn-box_active' : ''}`} ref={filterRef}>

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
                className={`words__search-btn${props.isLoading ? ' words__search-btn_inactive' : ''}`}
                type='button'
                onClick={handleSearchClick}>
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
                    <MenuItem
                      key={i}
                      value={i}
                    >
                      {i}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <div className='words__slider-wrapper'>
                <div className='words__heading-box'>
                  <h3 className='words__slider-heading'>Frequency</h3>
                  <RefTooltip class='words__fr-tlt' color='#757575'>
                    <p>Word frequency measure on the basis of American subtitle in Zipf format (scale 1-7).&nbsp;
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
                  <RefTooltip  class='words__fr-tlt' color='#757575'>
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

        <div className={`words__table-wrapper${animationFilter ? ' words__table-wrapper_active' : ''}`}>
          <table className='wtable'>

            <thead>
              <tr>
                <th className='wtable__th wtable__th_checkbox'>
                  <Tooltip title='add all words to the learning list' componentsProps={{ tooltip: { sx: tooltipOption, } }}>
                    <Checkbox
                      className='wtable__checkbox'
                      icon={<BookmarkBorderIcon sx={{ fontSize: '1.4rem', color: '#7575759c' }} />}
                      checkedIcon={<BookmarkIcon sx={{ fontSize: '1.4rem'}} />}
                      onChange={handleAllCheck}
                    />
                  </Tooltip>
                  {/* list of available languages */}
                  <Languages
                    languages={languages}
                    isActive={langListActive}
                    //selectLang={props.selectLang}
                    activeBtn={activeLangBtn}
                    //searchLang={props.searchLang}
                    //inputText={props.inputText}
                    commentActive={true}
                    closeLangList={closeLangList}
                  />
                </th>
                <th>word</th>
                <th className='wtable__th wtable__th_btn' /* onClick={() => props.openLangListWords('random')} */
                  onClick={toggleLangList}
                >
                  translation ({currentInputLang.code === 'en' ? currentOutputLang.code : currentInputLang.code})

                </th>
                <th>frequency</th>
                {/* <th>film %</th> */}



              </tr>

            </thead>

            <tbody>
              {words.map((i) => (
                <tr key={i.word}>
                  <td>
                    <Checkbox
                      className='wtable__checkbox'
                      icon={<BookmarkBorderIcon sx={{ fontSize: '1.4rem', color: '#7575759c' }}/>}
                      checkedIcon={<BookmarkIcon sx={{ fontSize: '1.4rem' }}/>}
                      onChange={() => handleCheck(i)}
                      checked={i.checked || false}
                      title='add to the learning list'
                    />
                  </td>
                  <td className='wtable__td wtable__td_emph'>{i.word}</td>
                  <td>{i.translation}</td>
                  <td className='wtable__td'>
                    <span className={`wtable__fr-btn${i.fr >= 4 ? ' wtable__fr-btn_high' : ''}`}>{i.frCat}</span>
                  </td>
                  {/* <td>{i.filmPer.toFixed(1)}%</td> */}

                </tr>
              ))}
            </tbody>
          </table>

          <div className={`words__table-overlay${props.isLoading ? ' words__table-overlay_active' : ''}`}>
            <Spinner isLoading={props.isLoading}/>
          </div>

          <span
            className={`words__not-found${!props.isLoading && words.length === 0 ? ' words__not-found_active' : ''}`}
          >
            Sorry, data not found. &#128532; Please try different filters <br />
          </span>
        </div>

      </div>

    </div>
  )
}

export default RandomWords;
