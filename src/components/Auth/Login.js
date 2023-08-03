import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthForm from "./AuthForm";
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { authorize } from '../../utils/api';
import { useSelector, useDispatch } from 'react-redux';
import { login } from '../../store/user';

function Login() {

  const [data, setData] = useState({});
  const [error, setError] = useState({});
  const [resetPassActive, setResetPassActive] = useState(false);

  const navigate = useNavigate();

  const textFieldsData = [
    { id: 'email', name: 'email', label: 'Email', type: 'email', required: true },
    { id: 'password', name: 'password', label: 'Password', type: 'password', autoComplete: 'on', required: true },
  ];

  /* const isLoggedIn = useSelector((state) => state.isLoggedIn);
  const userData = useSelector((state) => state.userData); */
  const dispatch = useDispatch();

  async function submitForm() {
    const response = await authorize(data);
    const { email, userName, token, serverError } = response;
    const userData = { email, userName };

    if (response.error) {
      //error text
      setError({ serverError });
    } else {
      //add token to local storage + save user data in store
      localStorage.setItem('token', token);
      dispatch(login({ userData }));
      navigate('/');
    }
  }

  return (
    <AuthForm
      textFieldsData={textFieldsData}
      data={data}
      setData={setData}
      submitForm={submitForm}
      form='Log in'
      question="Don't have an account?"
      route='/signup'
      refBtn='Sign up'
      btnText='Sign in'
      error={error}
      setError={setError}
    >
      <div className='auth__pass-box'>
        <FormControlLabel control={<Checkbox defaultChecked />} label='Remember me' className='auth__checkbox' />
        <button className='auth__pass-btn' onClick={() => setResetPassActive(true)}>
          <Link to='/restore-password'>Forgot password?</Link>
        </button>
      </div>
    </AuthForm>
  )
}

export default Login;
