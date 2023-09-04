import React from 'react';
import { useDispatch } from 'react-redux';
import { login, logout } from '../store/user';
import { useNavigate } from 'react-router-dom';

function useAuth() {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleLogin(token, email, userName) {
    localStorage.setItem('token', token);
    dispatch(login({ userData: { email, userName } }));
    navigate('/account/navigation');
    window.scrollTo(0, 0);
  };

  //clean storage after logout
  function droppStorage() {
    localStorage.removeItem('token');
    sessionStorage.removeItem('userWords');
    sessionStorage.removeItem('quizResults');
    sessionStorage.removeItem('collections');

  }

  function handleLogout() {
    droppStorage();
    dispatch(logout());
    navigate('/');
    window.scrollTo(0, 0);
  };

  return { handleLogin, handleLogout };
};

export default useAuth;
