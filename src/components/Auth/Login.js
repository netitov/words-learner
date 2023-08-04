import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthForm from "./AuthForm";
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { authorize } from '../../utils/api';
import { useDispatch } from 'react-redux';
import useAuth from '../../hooks/useAuth';

function Login() {

  const [data, setData] = useState({});
  const [error, setError] = useState({});
  const [resetPassActive, setResetPassActive] = useState(false);

  const { handleLogin } = useAuth();

  const textFieldsData = [
    { id: 'email', name: 'email', label: 'Email', type: 'email', required: true },
    { id: 'password', name: 'password', label: 'Password', type: 'password', autoComplete: 'on', required: true },
  ];

  async function submitForm() {
    const response = await authorize(data);
    const { email, userName, token, serverError } = response;

    if (response.error) {
      //error text
      setError({ serverError });
    } else {
      //add token to local storage + save user data in store
      handleLogin(token, email, userName);
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
        {/* <FormControlLabel control={<Checkbox defaultChecked />} label='Remember me' className='auth__checkbox' /> */}
        <button className='auth__pass-btn' onClick={() => setResetPassActive(true)}>
          <Link to='/password-reset'>Forgot password?</Link>
        </button>
      </div>
    </AuthForm>
  )
}

export default Login;
