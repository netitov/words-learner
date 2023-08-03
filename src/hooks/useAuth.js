import React from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../store/user'; // Подставьте свой путь к действию для логина
import { useNavigate } from 'react-router-dom';

function useAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleLogin(token, email, userName) {
    localStorage.setItem('token', token);
    dispatch(login({ userData: { email, userName } }));
    navigate('/');
    window.scrollTo(0, 0);
  };

  return { handleLogin };
};

export default useAuth;
