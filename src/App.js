import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Home from './pages/Home/Home';
import LoginPage from './pages/Auth/LoginPage';
import SignupPage from './pages/Auth/SignupPage';
import LinkRequestPage from './pages/Auth/LinkRequestPage';
import PasswordResetPage from './pages/Auth/PasswordResetPage';
import { login, userData } from './store/user';
import { useSelector, useDispatch } from 'react-redux';
import { getUserData, requestRandomWords,  getWordList, addToList, getCollections } from './utils/api';
import Spinner from './components/Spinner/Spinner';
import Account from './pages/Account/Account';
import useLangsFetch from './hooks/useLangsFetch';
import { useInitLang } from './hooks/useInitLang';
import { selectOutputLang } from './store/outputLang';
import { setRandomWords } from './store/randomWords';
import { setUserWords } from './store/userWords';
import { setCollections } from './store/collections';
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
        source: []
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

  //get user word list
  async function fetchWordsCollections() {
    const token = localStorage.getItem('token');
    //fetch words
    const collections = await getCollections(token);
    if (collections.err) {
      console.log(collections.err);
      return [];
    } else {
      return collections;
    }
  }

  //set user word list
  async function initializeUserWords() {
    const storage = JSON.parse(sessionStorage.getItem('userWords'));
    if (!storage) {
      //if words not in session storage - fetch them and add to session storage
      const wordList = await fetchUserWords();
      if (wordList.length > 0) {
        dispatch(setUserWords(wordList));
        sessionStorage.setItem('userWords', JSON.stringify(wordList));
      } else {
        //if user doesn't have saved words yet - use random words for exapmle
        const words = randomWords.slice(0, 5);
        //add random words to user list
        const addedRandomWords = await addRandomWordsToList(words);
        dispatch(setUserWords(addedRandomWords));
        sessionStorage.setItem('userWords', JSON.stringify(addedRandomWords));
      }
    } else {
      //if words are in storage - use them
      dispatch(setUserWords(storage));
    }
  }

  //set user words collections
  async function initializeWordsCollections() {
    const storage = JSON.parse(sessionStorage.getItem('collections'));
    if (!storage) {
      //if collections not in session storage - fetch them and add to session storage
      const collections = await fetchWordsCollections();
      if (collections.length > 0) {
        dispatch(setCollections(collections));
        sessionStorage.setItem('collections', JSON.stringify(collections));
      }
    } else {
      //if collections are in storage - use them
      dispatch(setCollections(storage));
    }
  }

  //set initial list of user words and collections
  useEffect(() => {
    if (randomWords.length > 0 && isLoggedIn) {
      initializeUserWords();
      initializeWordsCollections();
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
        await requestRandomWords();
      }
    }
  }

  // get init random words
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
