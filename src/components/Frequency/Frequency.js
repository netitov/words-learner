import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
import { checkFrequency, translate } from '../../utils/api';
import { getFreqCat } from '../../utils/getFreqCat';
import Bookmark from '../Bookmark/Bookmark';
import Snackbar from '../Snackbar/Snackbar';
import useWordSave from '../../hooks/useWordSave';
import { useSelector, useDispatch } from 'react-redux';
import { errorMessages } from '../../utils/constants';
import { showError } from '../../store/error';


function Frequency(props) {

  const [animation, setAnimation] = useState(false);
  const [chars, setChars] = useState('example');
  const [isLoading, setIsLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [frequency, setFrequency] = useState({ word: '', fr: 0, text: '', filmPer: 0 });
  //const [isChecked, setIsChecked] = useState(false);
  //const [snackbarActive, setSnackbarActive] = useState(false);

  const pathRef = useRef();

  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const currentInputLang = useSelector((state) => state.inputLang);
  const currentOutputLang = useSelector((state) => state.outputLang);
  const dictionLangs = useSelector((state) => state.dictionLangs);

  const dispatch = useDispatch();

  const { handleWordList, closeSnackbar, checkList, isChecked, snackbarActive } = useWordSave();

  //get translation if user addes a word to learning list
  async function getTranslation(text) {
    if (isLoggedIn) {
      const langs = currentInputLang.code + '-' + currentOutputLang.code;
      const inDictionary = dictionLangs.some((i) => i.languages === langs);

      const response = await translate({ langs, text, inDictionary });

      if (response.error) {
        dispatch(showError(errorMessages.general));
      } else if (response.length > 0) {
        const translation = response.text === undefined ? response[0].tr[0].text : response.text[0];
        return translation;
      } else {
        return 'not found';
      }
    } else {
      return '';
    }
  }

  //save word to learning list
  async function saveWord() {
    const translation = await getTranslation(chars);
    handleWordList(chars, translation);
  }

  //get word frequency
  async function getFrequency(word) {
    const response = await checkFrequency(word);

    if (response.error) {
      dispatch(showError(errorMessages.general));
    } else if (response.length > 0) {
      const obj = response[0];
      const frequencyNumber = obj.fr;

        //for feat search frequency (without translate)
      setFrequency({ word, fr: frequencyNumber, text: getFreqCat(frequencyNumber), filmPer: obj.filmPer });
    } else {
      setFrequency({ word: '', fr: 0, text: '', filmPer: 0 });
      setNotFound(true);
    }
    setIsLoading(false);
    checkList(word);
  }

  //call search frequency function
  useEffect(() => {
    //drop error 'no data'
    setNotFound(false);
    closeSnackbar();

    if(chars.length > 0) {
      //delay for spinner
      const timeOutLoading = setTimeout(() => setIsLoading(true), 500);
      //delay before api request
      const timeOutRequest = setTimeout(() => getFrequency(chars, true),1500);
      return () => {
        clearTimeout(timeOutRequest);
        clearTimeout(timeOutLoading);
      };
    } else {
      setIsLoading(false);
      setFrequency({ word: '', fr: 0, text: '', filmPer: 0 });
    }
  }, [chars]);



  //run animation
  useEffect(() => {
    function runAnimation() {
      const elementPos = pathRef.current.getBoundingClientRect().top;
      const elementHeight = pathRef.current.offsetHeight;
      const windowHeight = window.innerHeight;

      if (elementPos < windowHeight - (elementHeight * 0.3) && !props.account) {
        setAnimation(true);
      }
    }

    window.addEventListener('scroll', runAnimation);
    return () => window.removeEventListener('scroll', runAnimation);
  }, []);

  return (
    <div className='frequency-wrapper' id='frequency'>
      <div className='frequency'>
        <h2 className='frequency__heading heading2'>Check the word frequency</h2>
        <div className={`frequency__input-box${animation ? ' frequency__input-box_active' : ''}`} >
          <FormControl
            sx={{ m: 1, maxWidth: '577px', width: '100%', margin: 0 }}
            variant='filled'
            className='frequency__input'

            onChange={e => setChars(e.target.value.toLowerCase())}
          >
            <InputLabel htmlFor='filled-basic'>Enter a word in English</InputLabel>
            <FilledInput
              id='filled-basic'
              endAdornment={
                <InputAdornment position='end'>
                  <SearchIcon />
                </InputAdornment>
              }
              value={chars}
            />
            <Spinner isLoading={isLoading} />
            <span
              className={`frequency__not-found${notFound ? ' frequency__not-found_active' : ''}`}
            >
              Sorry, we don't have data on this word &#128532; <br />
            </span>
          </FormControl>

          <Bookmark
            toggleBookmark={saveWord}
            isChecked={isChecked}
            title='add to the learning list'
            propClass={`frequency__lst-btn${frequency.text !== '' && !isLoading ? ' frequency__lst-btn_active' : ''}`}
            width='21px'
            height='21px'
          />
          <Snackbar
            snackbarActive={snackbarActive}
            elClass='frequency__snack'
            closeSnack={closeSnackbar}
            transformPos='_left'
            closeBtnColor='#37636c'
          >
            <p className='frequency__snack-text'>
              <Link to='/signup'>Sign up</Link> / <Link to='/login'>Log in</Link>
              &nbsp;to create your own word list and much more
            </p>
          </Snackbar>
        </div>
        <div className={`frequency__card-box ${frequency.text !== '' && (animation || props.account) ? ' frequency__card-box_active' : ''}`} ref={pathRef}>

          <div className='frequency__card'>
            <h3 className={`frequency__value${isLoading ? ' frequency__value_loading' : ''}`}>
              {frequency.text}
            </h3>
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
            <div></div>
          </div>

          <div className='frequency__card'>
            <h3 className={`frequency__value${isLoading ? ' frequency__value_loading' : ''}`}>
              {frequency.fr.toFixed(1)}<span> / 7</span>
            </h3>
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
            <h3 className={`frequency__value${isLoading ? ' frequency__value_loading' : ''}`}>
              {frequency.filmPer.toFixed(1)}%
            </h3>
            <p>Film percent</p>
            <RefTooltip  class='frequency__tlt' color='#dbecec'>
              <p>Indicates in how many percent of films the word appears</p>
            </RefTooltip>
          </div>

        </div>
        <BsCheck2All className={`frequency__bck-svg bck-svg${animation ? ' frequency__bck-svg_active' : ''}`}/>
      </div>
    </div>
  )
}

export default Frequency;
