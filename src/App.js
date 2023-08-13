import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Home from './pages/Home/Home';
import LoginPage from './pages/Auth/LoginPage';
import SignupPage from './pages/Auth/SignupPage';
import LinkRequestPage from './pages/Auth/LinkRequestPage';
import PasswordResetPage from './pages/Auth/PasswordResetPage';
import { login, userData } from './store/user';
import { useSelector, useDispatch } from 'react-redux';
import { getUserData, requestRandomWords,  getWordList, addToList } from './utils/api';
import Spinner from './components/Spinner/Spinner';
import Account from './pages/Account/Account';
import useLangsFetch from './hooks/useLangsFetch';
import { useInitLang } from './hooks/useInitLang';
import { selectOutputLang } from './store/outputLang';
import { setRandomWords } from './store/randomWords';
import { setUserWords } from './store/userWords';
import useRandomWordsFetch from './hooks/useRandomWordsFetch';

function App() {

  const [isLoading, setIsLoading] = useState(true);

  const dispatch = useDispatch();

  //fetch languages list
  const { langsLoaded } = useLangsFetch();
  //initial user language
  const { setInitLang } = useInitLang();
  //fetch randomwords
  const { requestRandomWords } = useRandomWordsFetch();

  const languages = useSelector((state) => state.langList);
  const currentInputLang = useSelector((state) => state.inputLang);
  const currentOutputLang = useSelector((state) => state.outputLang);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const randomWordsInLoading = useSelector((state) => state.randomWords.isLoading);//remove?
  const randomWords = useSelector((state) => state.randomWords.data);
  const userWords = useSelector((state) => state.userWords);


  async function tokenCheck(token) {
    const response = await getUserData(token);
    const { email, userName } = response;

    if (!response.error) {
      dispatch(login({ userData: { email, userName } }));
      //navigate('/account');
    } else {
      localStorage.removeItem('token');
    }
    setIsLoading(false);
  }

  //get user data if token exists
  useEffect(() => {
    //switch on loading overlay
    setIsLoading(true)
    const token = localStorage.getItem('token');

    if (token && !isLoggedIn) {
      tokenCheck(token);
    } else {
      //switch off loading overlay
      setIsLoading(false);
    }

  }, [])

  //get init user language after language list is fetched
  useEffect(() => {
    if (!langsLoaded) {
      const userLang = JSON.parse(localStorage.getItem('userLang'));
      console.log(userLang)
      if (userLang) {
        dispatch(selectOutputLang(userLang));
      } else {
        setInitLang(languages);
      }
    }
  }, [langsLoaded]);

  //USER WORDS
  //if user doesn't have saved words yet - use random words
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
  async function fetchUserWords() {
    const token = localStorage.getItem('token');
    //fetch words
    const wordList = await getWordList(token);
    if (wordList.err) {
      console.log(wordList.err);
      return [];
    } else {
      return wordList;
    }
  }

  //set user word list
  async function initializeUserWords() {
    const storage = JSON.parse(sessionStorage.getItem('userWords'));
    if (!storage) {
      //if words not in session storage - fetch them and add to session storage
      const wordList = await fetchUserWords();
      console.log(wordList)
      if (wordList.length > 0) {
        dispatch(setUserWords(wordList));
        sessionStorage.setItem('userWords', JSON.stringify(wordList));
      } else {
        //if user doesn't have saved words yet - use random words for exapmle
        const words = randomWords.slice(0, 5);
        dispatch(setUserWords(wordList))
        sessionStorage.setItem('userWords', JSON.stringify(words));
        //add random words to user list
        await addRandomWordsToList(words);
      }
    } else {
      //if words are in storage - use them
      dispatch(setUserWords(storage));
    }
  }

  //set initial list of user word list
  useEffect(() => {
    if (randomWords.length > 0 && isLoggedIn) {
      initializeUserWords();
    }
  }, [randomWords, isLoggedIn])


  //RANDOM WORDS
  //get initial list of random words
  async function getInitRandomWords() {
    const currLang = JSON.parse(localStorage.getItem('userLang'));
    //run function of current language defined
    if (currLang) {

      const wordStorage = JSON.parse(sessionStorage.getItem('randomWords'));
      //if languages were not changed, use list of words from session storage
      if (wordStorage?.some((i) => i.lang === currLang.code)) {
        dispatch(setRandomWords(wordStorage));
      } else if (!randomWordsInLoading && randomWordsInLoading !== undefined) {
        console.log('else')
        await requestRandomWords();
      }
    }
  }

  // get init random words + quiz words/ update list of words if languages are changed
  useEffect(() => {
    getInitRandomWords();
  }, [currentInputLang, currentOutputLang]);


  return (
    <div className='page'>
      <div className='page__wrapper'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/signup' element={<SignupPage />} />
          <Route path='/password-reset' element={<LinkRequestPage />} />
          <Route path='/password-reset/:userId/:token' element={<PasswordResetPage />} />
          <Route path='/account/*' element={<Account />} />
        </Routes>
        <div className={`page__loading-overlay${isLoading ? ' page__loading-overlay_active' : ''}`}>
          <Spinner isLoading={isLoading}/>
        </div>
    </div>
  </div>
  )
}

export default App;
