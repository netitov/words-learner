import React from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import FilledInput from '@mui/material/FilledInput';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Spinner from '../Spinner/Spinner';
import RefTooltip from '../RefTooltip/RefTooltip';
import { BsBookmarks } from 'react-icons/bs';
import Tooltip from '@mui/material/Tooltip';
import { tooltipOption } from '../../utils/constants';
import { BsCheck2All } from 'react-icons/bs';

function Frequency(props) {

  return (
    <div className='frequency-wrapper' id='frequency'>
    <div className='frequency'>
      <h2 className='frequency__heading heading2'>Check the word frequency</h2>
      <div className='frequency__input-box'>
        <FormControl
          sx={{ m: 1, maxWidth: '577px', width: '100%', margin: 0 }}
          variant='filled'
          className='frequency__input'
          onChange={e => props.setCharsFreq(e.target.value)}
        >
          <InputLabel htmlFor='filled-basic'>Enter a word in English</InputLabel>
          <FilledInput
            id='filled-basic'
            endAdornment={
              <InputAdornment position='end'>
                <SearchIcon />
              </InputAdornment>
            }
          />
          <Spinner isLoading={props.frIsLoading} />
          <span
            className={`frequency__not-found${props.frNoData ? ' frequency__not-found_active' : ''}`}
          >
            Sorry, we don't have data on this word &#128532; <br />
          </span>
          <Tooltip title='add to the learning list' componentsProps={{ tooltip: { sx: tooltipOption, } }}>
            <button
              className={`frequency__lst-btn${props.wordFrequency.text !== '' ? ' frequency__lst-btn_active' : ''}`}
              type='button'
              onClick={props.handleLearnList}
            >
              <BsBookmarks size='20' className='frequency__svg'/>
            </button>
            </Tooltip>
        </FormControl>
      </div>
      <div className={`frequency__card-box ${props.wordFrequency.text !== '' ? ' frequency__card-box_active' : ''}`}>

        <div className='frequency__card'>
          <h3>{props.wordFrequency.text}</h3>
          <p>Frequency</p>
          <RefTooltip class='frequency__tlt' color='#dbecec'>
            <p>Word frequency measure on the basis of American subtitles (51 million words in total).&nbsp;
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

        <div className='frequency__card'>
          <h3>{props.wordFrequency.fr.toFixed(1)}<span> / 7</span></h3>
          <p>Frequency rate</p>
          <RefTooltip  class='frequency__tlt' color='#dbecec'>
            <p>Сategorical scale of the word frequency in Zipf format.&nbsp;
              <a
                href='http://crr.ugent.be/archives/1352'
                target='_blank'
                rel='noreferrer'
                className='frequency__tlt-link'
              >
                Learn more
              </a>
            </p>
          </RefTooltip>
        </div>

        <div className='frequency__card'>
          <h3>{props.wordFrequency.filmPer.toFixed(1)}%</h3>
          <p>Film percent</p>
          <RefTooltip  class='frequency__tlt' color='#dbecec'>
            <p>Indicates in how many percent of films the word appears</p>
          </RefTooltip>
        </div>

      </div>
      <BsCheck2All className='frequency__bck-svg bck-svg'/>
    </div>
    </div>
  )
}

export default Frequency;
