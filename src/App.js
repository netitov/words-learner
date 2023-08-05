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

function App() {

  const [isLoading, setIsLoading] = useState(true);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  //const userData = useSelector((state) => state.user.userData);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function tokenCheck(token) {
    const response = await getUserData(token);
    const { email, userName } = response;

    if (!response.error) {
      dispatch(login({ userData: { email, userName } }));
      navigate('/');
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

  return (
    <div className='page'>
      <div className='page__wrapper'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/signup' element={<SignupPage />} />
          <Route path='/password-reset' element={<LinkRequestPage />} />
          <Route path='/password-reset/:userId/:token' element={<PasswordResetPage />} />
        </Routes>
        <div className={`page__loading-overlay${isLoading ? ' page__loading-overlay_active' : ''}`}>
          <Spinner isLoading={isLoading}/>
        </div>
    </div>
  </div>
  )
}

export default App;
