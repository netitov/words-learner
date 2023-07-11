import React, { useEffect, useState, useMemo } from 'react';
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
import { tooltipOption } from '../../utils/constants';
import { defaultLang } from '../../utils/constants';


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

  const [pos, setPos] = useState([]); //props.randomWords
  const [words, setWords] = useState([]);
  const [frValue, setFrValue] = useState([4, 6]);
  const [perValue, setPerValue] = useState([0, 100]);

  useEffect(() => {
    setWords(props.randomWords);
  }, [props.randomWords])

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

  const getActiveLanguage = useMemo(() => {
    const value = props.activeLangOutput.code !== 'en' ? props.activeLangOutput : props.activeLangInput;
    //if selected lang is not in dictionary, use the default one
    const obj = props.enDicLangs.some((i) => i.language === value.lang) ? value : defaultLang;
    return { lang: obj.lang, code: obj.code, type: 'random' };
  }, [props.activeLangOutput, props.activeLangInput]);


  return (
    <div className='words'>
      <h2 className='words__heading heading2'>Find words</h2>

      <div className='words__dis-cont'>
        <p>Some random words you can start learning.</p>
        <p>Use filters to create a customized list of words</p>
      </div>

      <div className='words__container'>

        <div className='words__filter-box'>

          {/* container with table filters */}
          <div className='words__filter-cont'>

            <button
              className={`words__search-btn${props.wordsAreLoading ? ' words__search-btn_inactive' : ''}`}
              type='button'
              onClick={() => props.searchWords(pos, frValue, perValue)}>
                Search / update
            </button>

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

        <div className='words__table-wrapper'>
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
                    languages={props.enDicLangs}
                    isActive={props.isActive}
                    selectLang={props.selectLang}
                    activeBtn={getActiveLanguage}
                    searchLang={props.searchLang}
                    inputText={props.inputText}
                    commentActive={true}
                  />
                </th>
                <th>word</th>
                <th className='wtable__th wtable__th_btn' onClick={() => props.openLangList('random')}>
                  translation ({getActiveLanguage.code})

                </th>
                <th>frequency</th>
                <th>film %</th>



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
                  <td>{i.filmPer.toFixed(1)}%</td>

                </tr>
              ))}
            </tbody>
          </table>

          <div className={`words__table-overlay${props.wordsAreLoading ? ' words__table-overlay_active' : ''}`}>
            <Spinner isLoading={props.wordsAreLoading}/>
          </div>

          <span
            className={`words__not-found${!props.wordsAreLoading && words.length === 0 ? ' words__not-found_active' : ''}`}
          >
            Sorry, data not found. &#128532; Please try different filters <br />
          </span>
        </div>

      </div>

    </div>
  )
}

export default RandomWords;
