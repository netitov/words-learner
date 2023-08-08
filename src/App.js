import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Home from './pages/Home/Home';
import LoginPage from './pages/Auth/LoginPage';
import SignupPage from './pages/Auth/SignupPage';
import LinkRequestPage from './pages/Auth/LinkRequestPage';
import PasswordResetPage from './pages/Auth/PasswordResetPage';
import { login, userData } from './store/user';
import { useSelector, useDispatch } from 'react-redux';
import { getUserData } from './utils/api';
import Spinner from './components/Spinner/Spinner';
import Account from './pages/Account/Account';
import useLangsFetch from './hooks/useLangsFetch';
import { useInitLang } from './hooks/useInitLang';
import { selectOutputLang } from './store/outputLang';

function App() {

  const [isLoading, setIsLoading] = useState(true);

  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  //const { dataIsLoading } = useLangsFetch();
  //const userData = useSelector((state) => state.user.userData);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //fetch languages list
  const { dataIsLoading } = useLangsFetch();
  //initial user language
  const { setInitLang } = useInitLang();
  const languages = useSelector((state) => state.langList);



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
    if (!dataIsLoading) {
      // Возможно, вы захотите передать сюда data, чтобы useInitLang мог использовать его внутри себя
      const userLang = JSON.parse(localStorage.getItem('userLang'));
      if (userLang) {
        dispatch(selectOutputLang(userLang));

      } else {
        setInitLang(languages);
        console.log('lang added')
      }
    }
  }, [dataIsLoading]);



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
