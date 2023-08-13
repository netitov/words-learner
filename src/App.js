import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Home from './pages/Home/Home';
import LoginPage from './pages/Auth/LoginPage';
import SignupPage from './pages/Auth/SignupPage';
import LinkRequestPage from './pages/Auth/LinkRequestPage';
import PasswordResetPage from './pages/Auth/PasswordResetPage';
import { login, userData } from './store/user';
import { useSelector, useDispatch } from 'react-redux';
import { getUserData, requestRandomWords } from './utils/api';
import Spinner from './components/Spinner/Spinner';
import Account from './pages/Account/Account';
import useLangsFetch from './hooks/useLangsFetch';
import { useInitLang } from './hooks/useInitLang';
import { selectOutputLang } from './store/outputLang';
import { setRandomWords } from './store/randomWords';
import useRandomWordsFetch from './hooks/useRandomWordsFetch';

function App() {

  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({frSt: 3, frEn: 5.5 });



  const dispatch = useDispatch();
  const navigate = useNavigate();

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
  const randomWordsInLoading = useSelector((state) => state.randomWords.isLoading);



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


  //RANDOM WORDS

  //get initial list of random words
  async function getInitRandomWords() {
    const currLang = JSON.parse(localStorage.getItem('userLang'));
    //run function of current language defined
    if (currLang) {

      const wordStorage = JSON.parse(sessionStorage.getItem('randomWords'));
      //const quizStorage = JSON.parse(sessionStorage.getItem('quizQuestions'));
      //if languages were not changed, use list of words from session storage
      if (wordStorage?.some((i) => i.lang === currLang.code)) {
        //setQuizQuestions(quizStorage);

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
