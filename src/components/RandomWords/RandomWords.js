import React, { useState } from 'react';
import Slider from '@mui/material/Slider';


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


function RandomWords(props) {

  const initPos = [
    'Noun',
    'Adjective',
    'Verb',
  ];

  const [pos, setPos] = useState([]);
  const [frValue, setFrValue] = React.useState([0, 7]);
  const [perValue, setPerValue] = React.useState([0, 100]);

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


  return (
    <div className='words'>
      <h2 className='words__heading heading2'>Find words</h2>

      <div className='words__container'>

      <div className='words__filter-box'>

          <div className='words__dis-cont'>
            <p>Some random words you can start learning.</p>
            <p>Use filters to create a customized list of words</p>
          </div>

          {/* container with table filters */}
          <div className='words__filter-cont'>

            <button
              className='words__search-btn'
              type='button'
              onClick={() => props.searchWords(pos, frValue, perValue)}>
                Search
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
                <span>{props.getFreqCat(frValue[0])} / {props.getFreqCat(frValue[1])}</span>
              </div>

              <Slider
                value={frValue}
                name='frequency'
                onChange={handleChangeSLider}
                valueLabelDisplay='on'
                className='words__slider'
                step={0.5}
                min={0}
                max={7}
              />
            </div>

            <div className='words__slider-wrapper'>
              <h3 className='words__slider-heading'>Film percent</h3>
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
              <th>
                <Checkbox
                  className='wtable__checkbox'
                  icon={<BookmarkBorderIcon sx={{ fontSize: '1.4rem', color: '#757575c2' }} />}
                  checkedIcon={<BookmarkIcon sx={{ fontSize: '1.4rem'}} />}
                />
              </th>
              <th>word</th>
              <th>frequency</th>
              <th>translation</th>
            </tr>
          </thead>

          <tbody>
            {props.randomWords.map((i) => (
              <tr key={i.word}>
                <td>
                  <Checkbox
                    className='wtable__checkbox'
                    icon={<BookmarkBorderIcon sx={{ fontSize: '1.4rem', color: '#757575c2' }}/>}
                    checkedIcon={<BookmarkIcon sx={{ fontSize: '1.4rem' }}/>}
                  />
                </td>
                <td>{i.word}</td>
                <td>{i.frCat}</td>
                <td>{i.translation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


      </div>


    </div>
  )
}

export default RandomWords;
